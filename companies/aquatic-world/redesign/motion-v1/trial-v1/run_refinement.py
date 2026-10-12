"""Operate the single authorized Runway refinement without replaying paid calls."""
import argparse
import asyncio
import hashlib
import json
import sys
from datetime import datetime, timezone
from decimal import Decimal
from pathlib import Path

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

from run_trial import LIBRARY, PROJECT, STUDIO, TRIAL, call, inputs, save

REQUEST = 'aquatic_runway_20261012_02'
MODEL = 'runway/gen-4.5'
TERMINAL = {'completed', 'failed', 'cancelled', 'expired'}


def candidate(plan):
    entry = next(x for x in plan['planned_requests'] if x['candidate_id'] == 'runway-02')
    prompt = TRIAL / entry['prompt']['path']
    assert hashlib.sha256(prompt.read_bytes()).hexdigest() == entry['prompt']['sha256'], 'PROMPT_CHANGED'
    return entry, prompt.read_text()


def totals(plan):
    known = sum((Decimal(x['actual_cost_usd']) for x in plan['submissions'] if x.get('actual_cost_usd') is not None), Decimal('0'))
    reserved = sum((Decimal(x['estimated_cost_usd']) for x in plan['submissions'] if x.get('actual_cost_usd') is None), Decimal('0'))
    plan['submitted_generation_cost_usd'] = str(known)
    plan['reserved_submitted_estimate_usd'] = str(reserved)


async def run(action):
    plan = inputs()
    entry, prompt = candidate(plan)
    params = StdioServerParameters(command=sys.executable, args=[str(STUDIO / 'server.py')], cwd=str(STUDIO))
    async with stdio_client(params) as (reader, writer):
        async with ClientSession(reader, writer) as session:
            await session.initialize()
            if action == 'preflight':
                tools = (await session.list_tools()).tools
                submit = next(x for x in tools if x.name == 'submit_video')
                assert 'Runway' in submit.description and 'paused' in submit.description
                assets = await call(session, 'search_assets', {'library_id': LIBRARY, 'kind': 'video', 'limit': 20})
                assert assets['next_offset'] is None, 'ADDITIONAL_ASSETS_REQUIRE_REVIEW'
                assert {(x['asset_key'], x['version']) for x in assets['assets']} == {('runway-hero-trial-01', 1)}, 'NEW_ASSETS_REQUIRE_REVIEW'
                previous = await call(session, 'get_asset', {'library_id': LIBRARY, 'asset_key': 'runway-hero-trial-01', 'version': 1})
                assert previous['asset']['integrity'] == 'ok'
                assert previous['asset']['sha256'] == plan['provider_output_media'][0]['sha256']
                assert plan['verification']['creative_acceptance'] == 'failed_homepage_motion_brief'
                rules = await call(session, 'list_creative_rules', {'project_id': PROJECT, 'medium': 'video', 'character_id': 'hero-angelfish', 'style_id': 'calm-aquarium'})
                assert rules['rules'] == [], 'NEW_RULES_REQUIRE_REVIEW'
                first = await call(session, 'get_asset', {'library_id': LIBRARY, 'asset_key': 'hero-first-frame', 'version': 1})
                assert first['asset']['integrity'] == 'ok'
                assert first['asset']['sha256'] == plan['input']['first_frame']['sha256']
                pinned = await call(session, 'use_asset', {'library_id': LIBRARY, 'asset_key': 'hero-first-frame', 'version': 1, 'project_id': PROJECT, 'allow_draft': True})
                assert Path(pinned['file_path']).read_bytes() == (TRIAL / 'first-frame.png').read_bytes()
                balance = await call(session, 'get_account_balance', {})
                assert balance['key']['status'] == balance['account']['status'] == 'available'
                save('refinement-preflight.json', {'checked_at_utc': datetime.now(timezone.utc).isoformat(), 'tool_count': len(tools), 'asset_search': assets, 'rejected_existing_asset': {'asset_key': 'runway-hero-trial-01', 'version': 1, 'sha256': previous['asset']['sha256'], 'reason': 'Recorded motion and loop failures; user authorized a refinement'}, 'applicable_rules': rules['rules'], 'key_remaining_usd': balance['key']['limit_remaining_usd'], 'key_limit_usd': balance['key']['limit_usd'], 'account_balance_usd': balance['account']['balance_usd'], 'first_frame_sha256': first['asset']['sha256'], 'prompt_sha256': entry['prompt']['sha256']})
                save('refinement-input-pin.json', pinned)
                print(json.dumps({'state': 'refinement_preflight_passed', 'tools': len(tools), 'remaining_key_usd': balance['key']['limit_remaining_usd']}))
            elif action == 'submit':
                assert plan['authorization']['runway_refinement_authorized'] is True
                assert not any(x['request_id'] == REQUEST for x in plan['submissions']), 'ATTEMPT_RECORDED_USE_POLL'
                assert all(x['status'] in TERMINAL and x.get('actual_cost_usd') is not None for x in plan['submissions']), 'OUTSTANDING_ATTEMPT_REQUIRE_RECONCILIATION'
                assert len(plan['submissions']) < plan['authorization']['maximum_attempts']
                assert entry['status'] == 'not_submitted'
                pin = json.loads((TRIAL / 'refinement-input-pin.json').read_text())
                assert Path(pin['file_path']).read_bytes() == (TRIAL / 'first-frame.png').read_bytes()
                sys.path.insert(0, str(STUDIO))
                from open_router_video_mcp.config import load_settings
                from open_router_video_mcp.video import VideoService
                live = VideoService(load_settings().api_key)._live_model(MODEL)
                estimate = Decimal(live['pricing_skus']['cents_per_second_output']) * Decimal('0.01') * 6
                assert estimate == Decimal('0.72'), 'QUOTE_CHANGED_REVIEW_PLAN'
                known = sum(Decimal(x['actual_cost_usd']) for x in plan['submissions'])
                required = estimate * Decimal('1.2')
                assert known + required <= Decimal(plan['authorization']['generation_cap_usd']), 'USER_CAP_EXCEEDED'
                balance = await call(session, 'get_account_balance', {})
                assert balance['key']['status'] == balance['account']['status'] == 'available'
                assert required <= Decimal(balance['key']['limit_remaining_usd']), 'KEY_ALLOWANCE_INSUFFICIENT'
                assert required <= Decimal(balance['account']['balance_usd']), 'ACCOUNT_BALANCE_INSUFFICIENT'
                save('refinement-quote.json', {'quoted_at_utc': datetime.now(timezone.utc).isoformat(), 'model': MODEL, 'sku': 'cents_per_second_output', 'live_price_value': live['pricing_skus']['cents_per_second_output'], 'estimate_usd': str(estimate), 'required_with_20_percent_margin_usd': str(required), 'known_trial_cost_usd': str(known), 'key_remaining_usd': balance['key']['limit_remaining_usd'], 'generation_cap_usd': plan['authorization']['generation_cap_usd']})
                attempt = {'candidate_id': 'runway-02', 'request_id': REQUEST, 'model': MODEL, 'estimated_cost_usd': str(estimate), 'status': 'submission_started', 'recorded_at_utc': datetime.now(timezone.utc).isoformat(), 'job_id': None, 'actual_cost_usd': None, 'prompt_sha256': entry['prompt']['sha256'], 'first_frame_sha256': plan['input']['first_frame']['sha256']}
                plan['submissions'].append(attempt)
                entry['status'] = 'submission_started'
                totals(plan)
                plan['status'] = 'runway_refinement_submission_started_wan_paused'
                save('request-plan.json', plan)
                try:
                    result = await call(session, 'submit_video', {'model': MODEL, 'prompt': prompt, 'duration': 6, 'resolution': '720p', 'aspect_ratio': '16:9', 'generate_audio': False, 'first_frame_path': pin['file_path'], 'request_id': REQUEST})
                except BaseException:
                    attempt['status'] = entry['status'] = 'tool_error_or_unknown_do_not_resubmit'
                    save('request-plan.json', plan)
                    raise
                assert result['first_frame_sha256'] == plan['input']['first_frame']['sha256']
                save('runway-02-submit.json', result)
                for target in (attempt, entry):
                    target.update({k: result.get(k) for k in ('status', 'job_id', 'actual_cost_usd')})
                totals(plan)
                plan['status'] = 'runway_refinement_pending_wan_paused'
                save('request-plan.json', plan)
                print(json.dumps(result))
            else:
                assert any(x['request_id'] == REQUEST for x in plan['submissions']), 'NO_ATTEMPT_RECORDED'
                tool = 'get_video_status' if action == 'poll' else 'download_video'
                result = await call(session, tool, {'request_id': REQUEST})
                save('runway-02-status.json' if action == 'poll' else 'runway-02-download.json', result)
                attempt = next(x for x in plan['submissions'] if x['request_id'] == REQUEST)
                for target in (attempt, entry):
                    target.update({k: result.get(k) for k in ('status', 'job_id', 'actual_cost_usd')})
                totals(plan)
                plan['status'] = 'runway_refinement_' + result['status'] + '_wan_paused'
                save('request-plan.json', plan)
                print(json.dumps(result))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('action', choices=['preflight', 'submit', 'poll', 'download'])
    asyncio.run(run(parser.parse_args().action))

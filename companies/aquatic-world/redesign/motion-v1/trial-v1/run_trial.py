"""Operate this authorized trial through a fresh, controlled Video Studio MCP session."""
import argparse
import asyncio
import hashlib
import json
import os
import sys
import tempfile
from datetime import datetime, timezone
from decimal import Decimal
from pathlib import Path

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

TRIAL = Path(__file__).resolve().parent
STUDIO = Path('/Users/yapweijun/Documents/GitHub/Open-Router-Video-MCP')
PROJECT = 'aquatic-world-homepage-motion-v1'
REQUEST = 'aquatic_runway_20261011_01'
LIBRARY = 'aquatic-world-motion'


def save(name, data):
    path = TRIAL / name
    fd, temporary = tempfile.mkstemp(dir=TRIAL, prefix='.receipt-')
    try:
        with os.fdopen(fd, 'w') as stream:
            json.dump(data, stream, indent=2)
            stream.write('\n')
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(temporary, path)
    finally:
        Path(temporary).unlink(missing_ok=True)


def inputs():
    plan = json.loads((TRIAL / 'request-plan.json').read_text())
    for item in (plan['input']['first_frame'], plan['input']['prompt']):
        assert hashlib.sha256((TRIAL / item['path']).read_bytes()).hexdigest() == item['sha256']
    return plan


async def call(session, name, arguments):
    result = await session.call_tool(name, arguments)
    if result.is_error:
        codes = [x.text for x in result.content if getattr(x, 'type', None) == 'text']
        code = codes[0] if len(codes) == 1 and codes[0].replace('_', '').isalnum() else 'MCP_TOOL_ERROR'
        raise RuntimeError(code)
    for block in result.content:
        if getattr(block, 'type', None) == 'text':
            return json.loads(block.text)
    raise RuntimeError('MCP_RESULT_MISSING')


async def run(action):
    plan = inputs()
    params = StdioServerParameters(command=sys.executable, args=[str(STUDIO / 'server.py')], cwd=str(STUDIO))
    async with stdio_client(params) as (reader, writer):
        async with ClientSession(reader, writer) as session:
            await session.initialize()
            if action == 'preflight':
                tools = (await session.list_tools()).tools
                submit = next(t for t in tools if t.name == 'submit_video')
                assert 'first_frame_path' in submit.input_schema['properties']
                assert 'Runway' in submit.description and 'paused' in submit.description
                assets = await call(session, 'search_assets', {'library_id': LIBRARY, 'query': 'aquatic angelfish', 'kind': 'video'})
                rules = await call(session, 'list_creative_rules', {'project_id': PROJECT, 'medium': 'video', 'character_id': 'hero-angelfish', 'style_id': 'calm-aquarium'})
                assert rules['rules'] == [], 'NEW_RULES_REQUIRE_REVIEW'
                assert assets['assets'] == [], 'EXISTING_VIDEO_REQUIRES_REVIEW'
                source = STUDIO / 'outputs/aquatic-world-trial-v1/first-frame.png'
                source.parent.mkdir(parents=True, exist_ok=True)
                data = (TRIAL / 'first-frame.png').read_bytes()
                if source.exists():
                    assert source.read_bytes() == data, 'EXISTING_FRAME_CHANGED'
                else:
                    source.write_bytes(data)
                imported = await call(session, 'import_asset', {'library_id': LIBRARY, 'asset_key': 'hero-first-frame', 'request_id': 'aquatic_first_frame_20261011_v1', 'source_path': str(source), 'kind': 'image', 'title': 'Aquatic hero first frame', 'description': 'Shared 1280x720 deterministic crop from the existing illustrative hero.', 'tags': ['aquatic', 'angelfish', 'first-frame'], 'usage_notes': 'Draft input for the authorized paired video trial; same bytes for both models; no claim of real inventory.', 'license_note': 'Original built-in image generation 2026-10-10; requester-owned fictional local demo; crop provenance in Webpage-Design motion-v1.'})
                version = imported['asset']['version']
                pinned = await call(session, 'use_asset', {'library_id': LIBRARY, 'asset_key': 'hero-first-frame', 'version': version, 'project_id': PROJECT, 'allow_draft': True})
                assert hashlib.sha256(Path(pinned['file_path']).read_bytes()).hexdigest() == plan['input']['first_frame']['sha256']
                save('input-pin.json', pinned)
                save('stdio-preflight.json', {'checked_at_utc': datetime.now(timezone.utc).isoformat(), 'tool_count': len(tools), 'submit_description': submit.description, 'applicable_rules': rules['rules'], 'existing_matching_videos': assets['assets'], 'first_frame_sha256': pinned['asset']['sha256']})
                print(json.dumps({'state': 'fresh_stdio_preflight_passed', 'tools': len(tools), 'version': version}))
            elif action == 'submit-runway':
                assert not plan['submissions'], 'ATTEMPT_ALREADY_RECORDED_USE_POLL'
                pin = json.loads((TRIAL / 'input-pin.json').read_text())
                assert Path(pin['file_path']).read_bytes() == (TRIAL / 'first-frame.png').read_bytes()
                # Read the live rate again; the MCP independently repeats SKU and account checks.
                sys.path.insert(0, str(STUDIO))
                from open_router_video_mcp.config import load_settings
                from open_router_video_mcp.video import VideoService
                live = VideoService(load_settings().api_key)._live_model('runway/gen-4.5')
                estimate = Decimal(live['pricing_skus']['cents_per_second_output']) * Decimal('0.01') * 6
                assert estimate == Decimal('0.72'), 'QUOTE_CHANGED_REVIEW_PLAN'
                assert estimate * Decimal('1.2') <= Decimal(plan['authorization']['generation_cap_usd'])
                attempt = {'request_id': REQUEST, 'model': 'runway/gen-4.5', 'estimated_cost_usd': str(estimate), 'status': 'submission_started', 'recorded_at_utc': datetime.now(timezone.utc).isoformat(), 'job_id': None, 'actual_cost_usd': None}
                plan['submissions'].append(attempt)
                plan['submitted_generation_cost_usd'] = None
                plan['reserved_submitted_estimate_usd'] = str(estimate)
                plan['status'] = 'runway_submission_started_wan_paused'
                save('request-plan.json', plan)
                try:
                    result = await call(session, 'submit_video', {'model': 'runway/gen-4.5', 'prompt': (TRIAL / 'PROMPT.txt').read_text(), 'duration': 6, 'resolution': '720p', 'aspect_ratio': '16:9', 'generate_audio': False, 'first_frame_path': pin['file_path'], 'request_id': REQUEST})
                except BaseException:
                    attempt['status'] = 'tool_error_or_unknown_do_not_resubmit'
                    save('request-plan.json', plan)
                    raise
                assert result['first_frame_sha256'] == plan['input']['first_frame']['sha256']
                save('runway-submit.json', result)
                attempt.update({k: result.get(k) for k in ['status', 'job_id', 'actual_cost_usd']})
                plan['planned_requests'][1].update({k: result.get(k) for k in ['status', 'job_id', 'actual_cost_usd']})
                plan['planned_requests'][1]['blocking_conditions'] = []
                plan['status'] = 'runway_pending_wan_paused'
                save('request-plan.json', plan)
                print(json.dumps(result))
            elif action in ('poll-runway', 'download-runway'):
                name = 'get_video_status' if action == 'poll-runway' else 'download_video'
                result = await call(session, name, {'request_id': REQUEST})
                save('runway-status.json' if action == 'poll-runway' else 'runway-download.json', result)
                if plan['submissions']:
                    plan['submissions'][0].update({k: result.get(k) for k in ['status', 'job_id', 'actual_cost_usd']})
                    plan['planned_requests'][1].update({k: result.get(k) for k in ['status', 'job_id', 'actual_cost_usd']})
                    if result.get('actual_cost_usd') is not None:
                        plan['submitted_generation_cost_usd'] = result['actual_cost_usd']
                        if result['status'] in ('completed', 'failed', 'cancelled', 'expired'):
                            plan['reserved_submitted_estimate_usd'] = '0'
                    plan['status'] = 'runway_' + result['status'] + '_wan_paused'
                    save('request-plan.json', plan)
                print(json.dumps(result))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('action', choices=['preflight', 'submit-runway', 'poll-runway', 'download-runway'])
    asyncio.run(run(parser.parse_args().action))

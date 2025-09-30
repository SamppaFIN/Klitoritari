from pathlib import Path
from scripts.openrouter_client import OpenRouterClient, Policy


def test_policy_routing():
    policy = Policy(raw={
        "tiers": [
            {"name": "free_first", "models": ["openai/gpt-4o-mini"], "use_for": ["plan", "docs"]}
        ]
    })
    assert policy.route_model("plan") == "openai/gpt-4o-mini"


def test_client_from_env_missing_key(monkeypatch: 'pytest.MonkeyPatch'):
    monkeypatch.delenv("OPENROUTER_API_KEY", raising=False)
    client = OpenRouterClient.from_env()
    assert client is None



from pathlib import Path
from scripts.orchestrator import Handoff, record_handoff


def test_record_handoff(tmp_path: Path):
    log = tmp_path / "AURORA_LOG.md"
    p = record_handoff(Handoff(persona_from="🌸 Aurora", persona_to="🦅 Sable", goal="Perf budget check"), log)
    assert p == log
    text = log.read_text(encoding="utf-8")
    assert "Persona Handoff" in text
    assert "Aurora" in text and "Sable" in text



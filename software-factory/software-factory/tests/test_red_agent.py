from pathlib import Path
import tempfile

from scripts.red_agent import run_red_generation


def test_run_red_generation_creates_stubs(tmp_path: Path):
    repo_root = tmp_path
    codex_dir = repo_root / "Codex"
    codex_dir.mkdir(parents=True, exist_ok=True)
    # Create a sample markdown doc
    (codex_dir / "SAMPLE.md").write_text("""\
# Title One
## Subsection A
Content here.
""", encoding="utf-8")

    out_dir = tmp_path / ".factory-out" / "proj"
    count = run_red_generation(repo_root, out_dir, ["Codex/*.md"]) 
    assert count >= 1
    tests_dir = out_dir / "tests_red"
    assert tests_dir.exists()
    files = list(tests_dir.glob("test_*.py"))
    assert len(files) >= 1
    # Ensure generated file contains a failing RED test
    text = files[0].read_text(encoding="utf-8")
    assert "pytest.fail(" in text



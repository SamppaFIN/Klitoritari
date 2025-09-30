from pathlib import Path

from scripts.green_agent import satisfy_red_stubs


def test_satisfy_red_stubs(tmp_path: Path):
    tests_dir = tmp_path / "tests_red"
    tests_dir.mkdir(parents=True, exist_ok=True)
    f = tests_dir / "test_sample.py"
    f.write_text(
        'import pytest\n\n'
        'def test_red():\n'
        '    pytest.fail("RED: implement according to Codex/AC")\n',
        encoding="utf-8",
    )
    modified = satisfy_red_stubs(tests_dir)
    assert modified == 1
    text = f.read_text(encoding="utf-8")
    assert "assert True" in text



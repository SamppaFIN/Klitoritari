from pathlib import Path

from scripts.factory import detect_gaps


def test_detect_gaps_db_rls_missing(tmp_path: Path):
    gaps = detect_gaps(tmp_path)
    assert gaps["db_rls"] is True


def test_detect_gaps_db_rls_present(tmp_path: Path):
    db = tmp_path / "db"
    db.mkdir(parents=True, exist_ok=True)
    (db / "schema.sql").write_text("""
    -- enable row level security
    ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
    """, encoding="utf-8")
    gaps = detect_gaps(tmp_path)
    assert gaps["db_rls"] is False



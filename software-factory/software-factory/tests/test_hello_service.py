from pathlib import Path
import runpy


def test_hello_importable():
    # simple run without starting server
    path = Path("examples/hello-service/app.py")
    ns = runpy.run_path(str(path))
    assert "app" in ns



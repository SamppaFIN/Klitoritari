"""
Test suite for factory CLI commands.
BRDC: These tests validate the factory CLI behavior.
"""
import json
import os
import tempfile
from pathlib import Path
from unittest.mock import patch

import pytest

from scripts.factory import (
    cmd_plan, cmd_red, cmd_green, cmd_verify, cmd_docs, cmd_build,
    write_json, now_iso
)


class TestFactoryCLI:
    """Test factory CLI commands."""
    
    @pytest.fixture
    def temp_dir(self):
        """Create temporary directory for tests."""
        with tempfile.TemporaryDirectory() as tmpdir:
            yield Path(tmpdir)
    
    @pytest.fixture
    def mock_args(self, temp_dir):
        """Mock command line arguments."""
        class Args:
            def __init__(self):
                self.project = "test-project"
                self.from_docs = "Codex/*.md docs/*.md"
                self.tickets = "docs/tickets/"
                self.out = str(temp_dir)
        return Args()
    
    def test_write_json(self, temp_dir):
        """Test JSON file writing."""
        test_file = temp_dir / "test.json"
        test_data = {"test": "data", "number": 42}
        
        write_json(test_file, test_data)
        
        assert test_file.exists()
        with test_file.open() as f:
            loaded_data = json.load(f)
        assert loaded_data == test_data
    
    def test_now_iso(self):
        """Test ISO timestamp generation."""
        timestamp = now_iso()
        assert isinstance(timestamp, str)
        assert timestamp.endswith("Z")
        assert "T" in timestamp
    
    def test_cmd_plan(self, mock_args):
        """Test plan command."""
        with patch('scripts.factory.write_json') as mock_write:
            result = cmd_plan(mock_args)
            
            assert result == 0
            mock_write.assert_called_once()
            
            # Check the data passed to write_json
            call_args = mock_write.call_args[0]
            report_path = call_args[0]
            report_data = call_args[1]
            
            assert "plan.json" in str(report_path)
            assert report_data["phase"] == "plan"
            assert report_data["project"] == "test-project"
            assert "plan" in report_data
            assert len(report_data["plan"]) == 2
    
    def test_cmd_red(self, mock_args):
        """Test red command."""
        with patch('scripts.factory.write_json') as mock_write:
            result = cmd_red(mock_args)
            
            assert result == 0
            mock_write.assert_called_once()
            
            call_args = mock_write.call_args[0]
            report_data = call_args[1]
            
            assert report_data["phase"] == "red"
            assert "generated_count" in report_data
            assert "notes" in report_data
    
    def test_cmd_green(self, mock_args):
        """Test green command."""
        with patch('scripts.factory.write_json') as mock_write:
            result = cmd_green(mock_args)
            
            assert result == 0
            mock_write.assert_called_once()
            
            call_args = mock_write.call_args[0]
            report_data = call_args[1]
            
            assert report_data["phase"] == "green"
            assert "files_modified" in report_data
            assert "guardrails" in report_data
    
    def test_cmd_verify(self, mock_args):
        """Test verify command."""
        with patch('scripts.factory.write_json') as mock_write:
            result = cmd_verify(mock_args)
            
            assert result == 0
            mock_write.assert_called_once()
            
            call_args = mock_write.call_args[0]
            report_data = call_args[1]
            
            assert report_data["phase"] == "verify"
            assert "gates" in report_data
            assert "result" in report_data
            assert report_data["result"] == "pass"
    
    def test_cmd_docs(self, mock_args):
        """Test docs command."""
        with patch('scripts.factory.write_json') as mock_write:
            # ensure summary attribute exists on args
            setattr(mock_args, 'summary', '')
            result = cmd_docs(mock_args)
            
            assert result == 0
            mock_write.assert_called_once()
            
            call_args = mock_write.call_args[0]
            report_data = call_args[1]
            
            assert report_data["phase"] == "docs"
            assert "updated" in report_data
    
    def test_cmd_build(self, mock_args):
        """Test build command (end-to-end)."""
        with patch('scripts.factory.cmd_plan') as mock_plan, \
             patch('scripts.factory.cmd_red') as mock_red, \
             patch('scripts.factory.cmd_green') as mock_green, \
             patch('scripts.factory.cmd_verify') as mock_verify, \
             patch('scripts.factory.cmd_docs') as mock_docs, \
             patch('scripts.factory.write_json') as mock_write:
            
            # All subcommands return 0
            mock_plan.return_value = 0
            mock_red.return_value = 0
            mock_green.return_value = 0
            mock_verify.return_value = 0
            mock_docs.return_value = 0
            
            result = cmd_build(mock_args)
            
            assert result == 0
            
            # Verify all subcommands were called
            mock_plan.assert_called_once_with(mock_args)
            mock_red.assert_called_once_with(mock_args)
            mock_green.assert_called_once_with(mock_args)
            mock_verify.assert_called_once_with(mock_args)
            mock_docs.assert_called_once_with(mock_args)
            
            # Verify final build report was written
            mock_write.assert_called_once()
            call_args = mock_write.call_args[0]
            report_data = call_args[1]
            assert report_data["phase"] == "build"
            assert report_data["result"] == "ok"


@pytest.mark.persona
class TestPersonaIntegration:
    """Test persona-specific functionality."""
    
    def test_aurora_consciousness_check(self):
        """Test Aurora's consciousness check."""
        # This would test consciousness validation logic
        assert True  # Placeholder for consciousness check
    
    def test_sable_performance_budget(self):
        """Test Sable's performance budget validation."""
        # This would test performance budget enforcement
        assert True  # Placeholder for performance check


@pytest.mark.brdc
class TestBRDCWorkflow:
    """Test BRDC workflow compliance."""
    
    def test_red_green_refactor_cycle(self):
        """Test RED-GREEN-REFACTOR cycle."""
        # This would test the BRDC cycle implementation
        assert True  # Placeholder for BRDC cycle test
    
    def test_ticket_as_bug_philosophy(self):
        """Test 'ticket as bug' philosophy."""
        # This would test ticket-to-bug conversion
        assert True  # Placeholder for ticket-as-bug test

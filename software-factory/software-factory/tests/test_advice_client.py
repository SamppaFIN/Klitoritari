"""
Test suite for OpenRouter advice client.
BRDC: These tests validate the advice channel functionality.
"""
import json
import os
from unittest.mock import Mock, patch

import pytest
import requests

from scripts.advice import (
    load_env_file, parse_args, build_headers, main
)


class TestAdviceClient:
    """Test OpenRouter advice client."""
    
    def test_load_env_file(self, tmp_path):
        """Test environment file loading."""
        env_file = tmp_path / ".env"
        env_file.write_text("TEST_KEY=test_value\n# Comment\n\nANOTHER_KEY=another_value")
        
        with patch.dict(os.environ, {}, clear=True):
            load_env_file(str(env_file))
            
            assert os.environ["TEST_KEY"] == "test_value"
            assert os.environ["ANOTHER_KEY"] == "another_value"
            assert "Comment" not in os.environ
    
    def test_parse_args(self):
        """Test argument parsing."""
        with patch('sys.argv', ['advice.py', '--message', 'test message', '--system', 'test system']):
            args = parse_args()
            assert args.message == "test message"
            assert args.system == "test system"
            assert args.model == ""
    
    def test_build_headers(self):
        """Test header building."""
        headers = build_headers("test_key", "test_referer", "test_title")
        
        expected = {
            "Authorization": "Bearer test_key",
            "HTTP-Referer": "test_referer",
            "X-Title": "test_title",
            "Content-Type": "application/json",
        }
        assert headers == expected
    
    @patch('scripts.advice.requests.post')
    def test_main_success(self, mock_post):
        """Test successful API call."""
        # Mock successful response
        mock_response = Mock()
        mock_response.json.return_value = {
            "choices": [{"message": {"content": "Test response"}}]
        }
        mock_response.raise_for_status.return_value = None
        mock_post.return_value = mock_response
        
        with patch.dict(os.environ, {"OPENROUTER_API_KEY": "test_key"}, clear=True):
            with patch('sys.argv', ['advice.py', '--message', 'test message']):
                result = main()
                assert result == 0
    
    @patch('scripts.advice.requests.post')
    def test_main_no_choices(self, mock_post):
        """Test API response with no choices."""
        mock_response = Mock()
        mock_response.json.return_value = {"choices": []}
        mock_response.raise_for_status.return_value = None
        mock_post.return_value = mock_response
        
        with patch.dict(os.environ, {"OPENROUTER_API_KEY": "test_key"}, clear=True):
            with patch('sys.argv', ['advice.py', '--message', 'test message']):
                result = main()
                assert result == 3
    
    def test_main_no_api_key(self):
        """Test missing API key."""
        with patch.dict(os.environ, {}, clear=True):
            with patch('sys.argv', ['advice.py', '--message', 'test message']):
                result = main()
                assert result == 2
    
    @patch('scripts.advice.requests.post')
    def test_main_http_error(self, mock_post):
        """Test HTTP error handling."""
        mock_post.side_effect = requests.HTTPError("400 Bad Request")
        
        with patch.dict(os.environ, {"OPENROUTER_API_KEY": "test_key"}, clear=True):
            with patch('sys.argv', ['advice.py', '--message', 'test message']):
                result = main()
                assert result == 4


@pytest.mark.integration
class TestAdviceIntegration:
    """Integration tests for advice client."""
    
    @pytest.mark.skipif(not os.environ.get("OPENROUTER_API_KEY"), 
                       reason="OPENROUTER_API_KEY not set")
    def test_real_api_call(self):
        """Test real API call (requires API key)."""
        with patch('sys.argv', ['advice.py', '--message', 'Hello', '--model', 'openai/gpt-4o-mini']):
            result = main()
            assert result == 0

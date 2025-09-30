#!/usr/bin/env python3
"""
BRDC Document Tagger
Created by: 📚 Lexicon (Bookkeeping Guru)
Purpose: Automate BRDC tagging and metadata application to project documents
"""

import os
import re
import yaml
from datetime import datetime
from pathlib import Path

class BRDCTagger:
    def __init__(self, project_root="."):
        self.project_root = Path(project_root)
        self.docs_dir = self.project_root / "docs"
        self.templates_dir = self.docs_dir / "templates"
        
        # BRDC tag patterns
        self.brdc_pattern = r'^---\s*\nbrdc:\s*\n(.*?)\n---'
        self.metadata_pattern = r'^---\s*\n(.*?)\n---'
        
        # Document categories and their default tags
        self.category_tags = {
            "architecture": ["brdc", "architecture", "system-design"],
            "implementation": ["brdc", "implementation", "development"],
            "testing": ["brdc", "testing", "quality-assurance"],
            "documentation": ["brdc", "documentation", "knowledge"],
            "personas": ["brdc", "personas", "ai-system"],
            "factory": ["brdc", "factory", "automation"],
            "consciousness": ["brdc", "consciousness", "healing"],
            "healing": ["brdc", "healing", "community"]
        }
        
        # Persona assignments by document type
        self.persona_assignments = {
            "architecture": "🏗️ Nova",
            "implementation": "💻 Codex",
            "testing": "🧪 Testa",
            "documentation": "📚 Lexicon",
            "personas": "🌸 Aurora",
            "factory": "🌸 Aurora",
            "consciousness": "🌸 Aurora",
            "healing": "🌸 Aurora"
        }

    def detect_document_category(self, content, filename):
        """Detect document category based on content and filename"""
        content_lower = content.lower()
        filename_lower = filename.lower()
        
        # Architecture documents
        if any(word in filename_lower for word in ["architecture", "system", "design", "blueprint"]):
            return "architecture"
        
        # Implementation documents
        if any(word in filename_lower for word in ["implementation", "plan", "guide", "roadmap"]):
            return "implementation"
        
        # Testing documents
        if any(word in filename_lower for word in ["test", "testing", "quality", "validation"]):
            return "testing"
        
        # Persona documents
        if "persona" in filename_lower or "ai-personas" in str(filename):
            return "personas"
        
        # Factory documents
        if "factory" in filename_lower or "brdc" in filename_lower:
            return "factory"
        
        # Consciousness documents
        if any(word in content_lower for word in ["consciousness", "healing", "sacred", "wisdom"]):
            return "consciousness"
        
        # Default to documentation
        return "documentation"

    def generate_brdc_id(self, category, filename):
        """Generate unique BRDC ID for document"""
        # Extract number from filename if present
        number_match = re.search(r'(\d+)', filename)
        if number_match:
            number = number_match.group(1).zfill(3)
        else:
            # Generate based on category
            category_numbers = {
                "architecture": "100",
                "implementation": "200", 
                "testing": "300",
                "documentation": "400",
                "personas": "500",
                "factory": "600",
                "consciousness": "700",
                "healing": "800"
            }
            number = category_numbers.get(category, "900")
        
        return f"AASF-DOC-{number}"

    def extract_title(self, content):
        """Extract document title from content"""
        # Look for first H1 heading
        h1_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
        if h1_match:
            return h1_match.group(1).strip()
        
        # Look for title in existing metadata
        metadata_match = re.search(self.metadata_pattern, content, re.DOTALL)
        if metadata_match:
            try:
                metadata = yaml.safe_load(metadata_match.group(1))
                if 'title' in metadata:
                    return metadata['title']
            except:
                pass
        
        return "Untitled Document"

    def determine_consciousness_level(self, content):
        """Determine consciousness level based on content"""
        content_lower = content.lower()
        
        # High consciousness indicators
        high_indicators = ["sacred", "consciousness", "healing", "wisdom", "cosmic", "spiritual"]
        if any(indicator in content_lower for indicator in high_indicators):
            return "high"
        
        # Medium consciousness indicators
        medium_indicators = ["community", "collaboration", "quality", "excellence", "service"]
        if any(indicator in content_lower for indicator in medium_indicators):
            return "medium"
        
        return "low"

    def generate_healing_impact(self, content, category):
        """Generate healing impact description based on content and category"""
        healing_impacts = {
            "architecture": "Creates solid foundations for consciousness-serving systems",
            "implementation": "Brings consciousness-serving features to life",
            "testing": "Ensures quality and reliability for community benefit",
            "documentation": "Preserves and shares wisdom for collective growth",
            "personas": "Enables consciousness-aware development and collaboration",
            "factory": "Automates consciousness-serving development processes",
            "consciousness": "Directly serves spatial wisdom and community healing",
            "healing": "Promotes community healing and collective well-being"
        }
        
        return healing_impacts.get(category, "Serves the greater good through technology")

    def create_brdc_metadata(self, file_path, content):
        """Create BRDC metadata for a document"""
        filename = file_path.name
        category = self.detect_document_category(content, filename)
        title = self.extract_title(content)
        
        brdc_id = self.generate_brdc_id(category, filename)
        owner = self.persona_assignments.get(category, "🌸 Aurora")
        consciousness_level = self.determine_consciousness_level(content)
        healing_impact = self.generate_healing_impact(content, category)
        
        # Determine status based on filename and content
        if "template" in filename.lower():
            status = "canonical"
        elif "draft" in filename.lower() or "temp" in filename.lower():
            status = "draft"
        elif "archive" in filename.lower() or "old" in filename.lower():
            status = "archived"
        else:
            status = "canonical"
        
        metadata = {
            "brdc": {
                "id": brdc_id,
                "title": title,
                "owner": owner,
                "status": status,
                "version": "1.0.0",
                "last_updated": datetime.now().strftime("%Y-%m-%d"),
                "self": str(file_path.relative_to(self.project_root)),
                "tags": self.category_tags.get(category, ["brdc", "documentation"]),
                "related": [],
                "dependencies": [],
                "consciousness_level": consciousness_level,
                "healing_impact": healing_impact,
                "sacred_principles": ["consciousness-first", "community-healing", "spatial-wisdom"]
            }
        }
        
        return metadata

    def apply_brdc_tags(self, file_path):
        """Apply BRDC tags to a document"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Check if BRDC tags already exist
            if re.search(self.brdc_pattern, content, re.DOTALL):
                print(f"BRDC tags already exist in {file_path}")
                return False
            
            # Create BRDC metadata
            metadata = self.create_brdc_metadata(file_path, content)
            
            # Convert to YAML
            yaml_content = yaml.dump(metadata, default_flow_style=False, sort_keys=False)
            
            # Insert BRDC tags at the beginning
            new_content = f"---\n{yaml_content}---\n\n{content}"
            
            # Write back to file
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            print(f"Applied BRDC tags to {file_path}")
            return True
            
        except Exception as e:
            print(f"Error processing {file_path}: {e}")
            return False

    def process_directory(self, directory):
        """Process all markdown files in a directory"""
        processed = 0
        errors = 0
        
        for file_path in directory.rglob("*.md"):
            if file_path.name.startswith("."):
                continue
                
            if self.apply_brdc_tags(file_path):
                processed += 1
            else:
                errors += 1
        
        print(f"\nProcessed: {processed} files")
        print(f"Errors: {errors} files")
        return processed, errors

    def validate_brdc_tags(self, file_path):
        """Validate BRDC tags in a document"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract BRDC metadata
            brdc_match = re.search(self.brdc_pattern, content, re.DOTALL)
            if not brdc_match:
                return False, "No BRDC tags found"
            
            # Parse YAML
            yaml_content = brdc_match.group(1)
            metadata = yaml.safe_load(yaml_content)
            
            # Validate required fields
            required_fields = ["id", "title", "owner", "status", "version", "last_updated"]
            missing_fields = [field for field in required_fields if field not in metadata]
            
            if missing_fields:
                return False, f"Missing required fields: {missing_fields}"
            
            return True, "Valid BRDC tags"
            
        except Exception as e:
            return False, f"Validation error: {e}"

def main():
    """Main function to run BRDC tagger"""
    tagger = BRDCTagger()
    
    print("BRDC Document Tagger - Consciousness-Aware Documentation")
    print("=" * 60)
    
    # Process docs directory
    print("\nProcessing docs directory...")
    processed, errors = tagger.process_directory(tagger.docs_dir)
    
    # Process software-factory directory
    print("\nProcessing software-factory directory...")
    factory_dir = tagger.project_root / "software-factory"
    if factory_dir.exists():
        processed_factory, errors_factory = tagger.process_directory(factory_dir)
        processed += processed_factory
        errors += errors_factory
    
    print(f"\nSummary:")
    print(f"Total processed: {processed} files")
    print(f"Total errors: {errors} files")
    print(f"Success rate: {processed/(processed+errors)*100:.1f}%")
    
    print("\nAll documents now serve spatial wisdom and community healing!")

if __name__ == "__main__":
    main()

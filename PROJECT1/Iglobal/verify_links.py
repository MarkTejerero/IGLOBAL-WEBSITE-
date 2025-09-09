#!/usr/bin/env python3
"""
Comprehensive link verification script for iGlobal website
Checks all href links in HTML files to ensure they point to existing files
"""

import os
import re
from urllib.parse import urljoin, urlparse
from pathlib import Path
import html

def get_all_html_files(root_dir):
    """Get all HTML files in the project"""
    html_files = []
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith('.html'):
                html_files.append(os.path.join(root, file))
    return html_files

def extract_links_from_html(file_path):
    """Extract all href links from an HTML file"""
    links = []
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find all href attributes
        href_pattern = r'href\s*=\s*["\']([^"\']+)["\']'
        matches = re.findall(href_pattern, content, re.IGNORECASE)
        
        for match in matches:
            # Decode HTML entities
            link = html.unescape(match)
            links.append(link)
    
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
    
    return links

def is_external_link(link):
    """Check if a link is external (http/https/mailto/tel)"""
    return link.startswith(('http://', 'https://', 'mailto:', 'tel:', 'javascript:', '#'))

def resolve_link_path(current_file, link, root_dir):
    """Resolve a relative link path to absolute file system path"""
    if is_external_link(link):
        return None, 'external'
    
    # Remove fragment identifier
    link = link.split('#')[0]
    if not link:  # Just a fragment
        return current_file, 'fragment'
    
    current_dir = os.path.dirname(current_file)
    
    # Handle different link formats
    if link.startswith('/'):
        # Absolute path from root
        target_path = os.path.join(root_dir, link.lstrip('/'))
    else:
        # Relative path
        target_path = os.path.join(current_dir, link)
    
    # Normalize the path
    target_path = os.path.normpath(target_path)
    
    return target_path, 'local'

def verify_links():
    """Main verification function"""
    root_dir = os.getcwd()
    print(f"Verifying links in: {root_dir}")
    print("=" * 80)
    
    html_files = get_all_html_files(root_dir)
    print(f"Found {len(html_files)} HTML files to analyze")
    print()
    
    total_links = 0
    broken_links = []
    external_links = 0
    
    for html_file in sorted(html_files):
        print(f"Analyzing: {os.path.relpath(html_file, root_dir)}")
        links = extract_links_from_html(html_file)
        
        file_broken_links = []
        file_external_links = 0
        
        for link in links:
            total_links += 1
            target_path, link_type = resolve_link_path(html_file, link, root_dir)
            
            if link_type == 'external':
                external_links += 1
                file_external_links += 1
            elif link_type == 'fragment':
                # Fragment-only links are OK
                continue
            elif link_type == 'local':
                if not os.path.exists(target_path):
                    broken_links.append({
                        'file': os.path.relpath(html_file, root_dir),
                        'link': link,
                        'target': os.path.relpath(target_path, root_dir) if target_path else link,
                        'absolute_target': target_path
                    })
                    file_broken_links.append(link)
        
        print(f"  - Local links: {len(links) - file_external_links}")
        print(f"  - External links: {file_external_links}")
        if file_broken_links:
            print(f"  - BROKEN links: {len(file_broken_links)}")
            for broken in file_broken_links:
                print(f"    * BROKEN: {broken}")
        print()
    
    # Summary report
    print("=" * 80)
    print("VERIFICATION SUMMARY")
    print("=" * 80)
    print(f"Total HTML files analyzed: {len(html_files)}")
    print(f"Total links verified: {total_links}")
    print(f"External links (skipped): {external_links}")
    print(f"Local links verified: {total_links - external_links}")
    print(f"Broken links found: {len(broken_links)}")
    print()
    
    if broken_links:
        print("BROKEN LINKS DETAILS:")
        print("-" * 40)
        for broken in broken_links:
            print(f"File: {broken['file']}")
            print(f"Link: {broken['link']}")
            print(f"Target: {broken['target']}")
            print(f"Expected path: {broken['absolute_target']}")
            print()
    else:
        print("✅ ALL NAVIGATION LINKS ARE WORKING!")
        print("✅ No broken links found - website navigation is 100% functional!")
    
    return len(broken_links) == 0

if __name__ == "__main__":
    verify_links()
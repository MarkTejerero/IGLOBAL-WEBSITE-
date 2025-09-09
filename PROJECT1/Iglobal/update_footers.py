#!/usr/bin/env python3
"""
Script to update all HTML files with the new static footer design
"""

import os
import re
import glob

def get_relative_path_to_assets(file_path, base_dir):
    """Get the correct relative path to assets folder based on file depth"""
    # Get relative path from file to base directory
    rel_path = os.path.relpath(base_dir, os.path.dirname(file_path))
    if rel_path == '.':
        return 'assets/logo.jpg'
    else:
        return rel_path.replace('\\', '/') + '/assets/logo.jpg'

def get_footer_html(assets_path):
    """Generate footer HTML with correct asset path"""
    return f"""    <!-- Static Footer -->
    <footer class="static-footer">
        <div class="static-footer-container">
            <!-- Left Section: Logo and Social Media -->
            <div class="footer-left">
                <div class="footer-logo">
                    <img src="{assets_path}" alt="iGlobal Opportunities Logo">
                </div>
                
                <div class="footer-social">
                    <h4>Follow us</h4>
                    <div class="social-icons-static">
                        <a href="#" class="social-icon-static facebook">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" class="social-icon-static instagram">
                            <i class="fab fa-instagram"></i>
                        </a>
                        <a href="#" class="social-icon-static twitter">
                            <i class="fab fa-twitter"></i>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Center Section: Contact Information -->
            <div class="footer-center">
                <h3>Get in touch</h3>
                
                <!-- Philippines Contact -->
                <div class="contact-location">
                    <div class="location-header">PHILIPPINES</div>
                    <div class="contact-item-static">
                        <i class="fas fa-phone"></i>
                        <span>(8) 556 6248</span>
                    </div>
                    <div class="contact-item-static">
                        <i class="fas fa-map-marker-alt"></i>
                        <div class="contact-address">
                            <span>Vicente Madrigal Building,</span>
                            <span>6793, Ayala Avenue, Makati,</span>
                            <span>1226 Metro Manila</span>
                        </div>
                    </div>
                    <div class="contact-item-static">
                        <i class="fas fa-envelope"></i>
                        <span>intl.legalspecialist@yahoo.com.ph</span>
                    </div>
                </div>
                
                <!-- MARA Certification -->
                <div class="mara-badge-static">
                    <div class="mara-logo-static">MARA</div>
                    <div class="mara-info-static">
                        <span class="mara-title-static">
                            Migration<br/>Agents<br/>Registration<br/>Authority
                        </span>
                        <div class="mara-number-static">
                            <span>Migration Agents</span>
                            <span>Registration Number</span>
                            <strong>1067176</strong>
                            <span class="mara-website-static">www.mara.gov.au</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Section: Useful Links -->
            <div class="footer-right">
                <h3>Useful Links</h3>
                <ul class="useful-links-static">
                    <li><a href="https://www.canada.ca/en/immigration-refugees-citizenship.html" target="_blank">Immigration, Refugees and Citizenship Canada</a></li>
                    <li><a href="https://www.immigration.govt.nz/" target="_blank">New Zealand Immigration</a></li>
                    <li><a href="https://immi.homeaffairs.gov.au/" target="_blank">Australia Home Affairs</a></li>
                    <li><a href="https://www.cicnews.com/" target="_blank">CIC News</a></li>
                </ul>
            </div>
        </div>
        
        <!-- Copyright Bar -->
        <div class="footer-bottom-static">
            <p>&copy; 2025 iGlobal Opportunities. All rights reserved.</p>
        </div>
    </footer>"""

def update_html_file(file_path, base_dir):
    """Update a single HTML file with new footer"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Skip if already updated (check for static-footer class)
        if 'static-footer' in content:
            print(f"✓ Already updated: {file_path}")
            return True
        
        # Get correct asset path
        assets_path = get_relative_path_to_assets(file_path, base_dir)
        new_footer = get_footer_html(assets_path)
        
        # Multiple footer patterns to match
        footer_patterns = [
            # Pattern 1: Simple footer with class="footer"
            r'<footer class="footer">.*?</footer>',
            # Pattern 2: Tailwind footer from index.html
            r'<!-- Footer -->\s*<footer class="bg-gray-900 text-white py-16">.*?</footer>',
            # Pattern 3: Any footer tag
            r'<footer[^>]*>.*?</footer>',
        ]
        
        updated = False
        for pattern in footer_patterns:
            if re.search(pattern, content, re.DOTALL):
                content = re.sub(pattern, new_footer, content, flags=re.DOTALL)
                updated = True
                break
        
        if updated:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ Updated: {file_path}")
            return True
        else:
            print(f"⚠ No footer found to replace in: {file_path}")
            return False
            
    except Exception as e:
        print(f"✗ Error updating {file_path}: {str(e)}")
        return False

def main():
    base_dir = r"C:\Users\Mark\Documents\PROJECT1\Iglobal"
    
    # Find all HTML files
    html_files = []
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith('.html'):
                html_files.append(os.path.join(root, file))
    
    print(f"Found {len(html_files)} HTML files to process...")
    
    updated_count = 0
    for file_path in html_files:
        if update_html_file(file_path, base_dir):
            updated_count += 1
    
    print(f"\n✅ Successfully updated {updated_count} out of {len(html_files)} files")

if __name__ == "__main__":
    main()
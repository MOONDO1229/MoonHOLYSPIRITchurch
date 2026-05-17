import os

def search_files(directory, search_str):
    found_count = 0
    for root, dirs, files in os.walk(directory):
        if '.next' in root or 'node_modules' in root:
            continue
        for file in files:
            if file.endswith(('.js', '.sql', '.md', '.css')):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        if search_str in content:
                            print(f"Found in {path}")
                            found_count += 1
                except:
                    pass
    print(f"Total files with '{search_str}': {found_count}")

search_files('.', '퇴촌')

import os
import shutil

SOURCE_DIR = os.getcwd()
TARGET_DIR = "C:/wamp/www/panorama"
IGNORE_PATTERNS = ('*.py','*.rmd','.git','.gitignore',tmp','.svn')

# Deleting all files in the target dir
for the_file in os.listdir(TARGET_DIR):
    file_path = os.path.join(TARGET_DIR, the_file)
    try:
        if os.path.isfile(file_path):
            os.unlink(file_path)
    except (OSError, IOError) as e:
        print(e)

#os.path.mkdir(dir)

# copying all files to target dir
if os.path.exists(TARGET_DIR):
    shutil.rmtree(TARGET_DIR)

shutil.copytree(SOURCE_DIR, TARGET_DIR, ignore=shutil.ignore_patterns(*IGNORE_PATTERNS))


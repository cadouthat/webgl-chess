import shutil
import os
import sys
import subprocess

def failure(reason):
	print(reason)
	sys.exit(1)

source = "../client/"
release = "../../release/"

if os.path.exists(release):
	shutil.rmtree(release)

os.mkdir(release)

shutil.copy(source + "index.html", release)
shutil.copytree(source + "css/", release + "css/")
shutil.copytree(source + "thirdparty/", release + "thirdparty/")

tmp = release + "tmp/"
os.mkdir(tmp)

js = source + "js/"
for path in os.listdir(js):
	shutil.copy(js + path, tmp)

mdl = source + "mdl/"
for path in os.listdir(mdl):
	shutil.copy(mdl + path, tmp)

if subprocess.call(["python", "transform_js/wrap_shaders.py", source + "glsl/", tmp]) != 0:
	failure("Failed to wrap shaders")

if subprocess.call(["python", "transform_js/bundle_js.py", tmp, release + "app.js"]) != 0:
	failure("Failed to bundle js")

shutil.rmtree(tmp)

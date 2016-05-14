import shutil
import os
import sys
import subprocess

def failure(reason):
	print(reason)
	sys.exit(1)

def copyCollapse(dir, dest):
	for path in os.listdir(dir):
		if os.path.isdir(dir + path):
			copyCollapse(dir + path + "/", dest)
		else:
			shutil.copy(dir + path, dest)

def copyShallow(dir, dest):
	for path in os.listdir(dir):
		if not os.path.isdir(dir + path):
			shutil.copy(dir + path, dest)

source = "../client/"
release = "../../release/"

if os.path.exists(release):
	shutil.rmtree(release)

os.mkdir(release)

shutil.copy(source + "index.html", release)
shutil.copytree(source + "css/", release + "css/")
shutil.copytree(source + "thirdparty/", release + "thirdparty/")
shutil.copytree(source + "mdl/tex/", release + "tex/")

tmp = release + "tmp/"
os.mkdir(tmp)
copyCollapse(source + "js/", tmp)
copyShallow(source + "mdl/", tmp)

if subprocess.call(["python", "transform_js/wrap_shaders.py", source + "glsl/", tmp]) != 0:
	failure("Failed to wrap shaders")

if subprocess.call(["python", "transform_js/bundle_js.py", tmp, release + "app.js"]) != 0:
	failure("Failed to bundle js")

shutil.rmtree(tmp)

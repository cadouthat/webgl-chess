import sys
import os
import shutil

def convert(source, dest):
	var_name = os.path.basename(source).replace(".", "_")
	with open(dest, "w") as dest:
		dest.write("var src_" + var_name + " = \"\"")
		with open(source, "r") as source:
			for line in source.readlines():
				line = line.replace("\\", "\\\\")
				line = line.replace("\"", "\\\"")
				line = line.replace("\r", "")
				line = line.replace("\n", "\\n")
				dest.write(" +\n")
				dest.write("\t\"" + line + "\"")
		dest.write(";\n")
		dest.write("var shd_" + var_name + " = null;\n")

if len(sys.argv) < 3:
	print("Arguments: <source dir> <dest dir>")
	sys.exit(1)

source = sys.argv[1]
dest = sys.argv[2]
for path in os.listdir(source):
	dest_path = dest + path + ".js"
	convert(source + path, dest_path)

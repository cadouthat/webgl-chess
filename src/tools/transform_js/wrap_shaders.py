import sys
import os
import shutil

def convert(source, dest):
	# JavaScript variable name based on file name
	var_name = os.path.basename(source).replace(".", "_")
	# Open output file
	with open(dest, "w") as dest:
		# Begin JavaScript source string
		dest.write("var src_" + var_name + " = \"\"")
		# Read input file by line
		with open(source, "r") as source:
			for line in source.readlines():
				# Escape backslashes, double quotes, and newlines
				line = line.replace("\\", "\\\\")
				line = line.replace("\"", "\\\"")
				line = line.replace("\r", "")
				line = line.replace("\n", "\\n")
				# Write line as a concatenated JavaScript string
				dest.write(" +\n")
				dest.write("\t\"" + line + "\"")
		# End source string
		dest.write(";\n")
		# Write placeholder variable for compiled shader
		dest.write("var shd_" + var_name + " = null;\n")

if len(sys.argv) < 3:
	print("Arguments: <source dir> <dest dir>")
	sys.exit(1)

source = sys.argv[1]
dest = sys.argv[2]
# Convert all files in source and save in dest
for path in os.listdir(source):
	dest_path = dest + path + ".js"
	convert(source + path, dest_path)

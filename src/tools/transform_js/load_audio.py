import sys
import os
import shutil

def loader(source, dest):
	# JavaScript variable name based on file name
	var_name = os.path.basename(source).replace(".", "_")
	# Open output file
	with open(dest, "w") as dest:
		# Initialize the Audio object
		dest.write("var " + var_name + " = new Audio(\"")
		dest.write("audio/" + os.path.basename(source))
		dest.write("\");\n")

if len(sys.argv) < 3:
	print("Arguments: <source dir> <dest dir>")
	sys.exit(1)

source = sys.argv[1]
dest = sys.argv[2]
# Convert all files in source and save in dest
for path in os.listdir(source):
	dest_path = dest + path + ".js"
	loader(source + path, dest_path)

import sys
import os

if len(sys.argv) < 3:
	print("Arguments: <source dir> <dest file>")
	sys.exit(1)

source = sys.argv[1]
with open(sys.argv[2], "w") as dest:
	for path in os.listdir(source):
		with open(source + path, "r") as content:
			dest.write(content.read())
			dest.write("\n")

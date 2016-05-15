import sys
import os

if len(sys.argv) < 3:
	print("Arguments: <source dir> <dest file>")
	sys.exit(1)

# Open file for writing
source = sys.argv[1]
with open(sys.argv[2], "w") as dest:
	# File header
	dest.write("// Copyright 2016 Connor Douthat\n")
	dest.write("// https://github.com/cadouthat/webgl-chess\n\n")
	# Enumerate files for bundling
	for path in os.listdir(source):
		# Open and append contents to output
		with open(source + path, "r") as content:
			dest.write(content.read())
			dest.write("\n")

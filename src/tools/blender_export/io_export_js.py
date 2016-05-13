# Export blender meshes to JavaScript arrays
# Originally created for webgl-chess: https://github.com/cadouthat/webgl-chess
# by: Connor Douthat
# 5/12/2016

bl_info = {
	"name": "Export JavaScript (.js)",
	"author": "Connor Douthat",
	"version": (1, 0),
	"blender": (2, 71, 0),
	"location": "File > Export > JavaScript (.js)",
	"description": "Export mesh data as JavaScript arrays",
	"warning": "",
	"wiki_url": "https://github.com/cadouthat/webgl-chess",
	"category": "Import-Export"}

import bpy
import os
from bpy.props import StringProperty, BoolProperty
from bpy_extras.io_utils import ExportHelper

def write(filepath):
	scene = bpy.context.scene

	if len(bpy.context.selected_objects) > 1:
		raise AssertionError("Please select only one object")

	for obj in bpy.context.selected_objects:
		me = obj.to_mesh(scene, True, "PREVIEW")
		if me is None:
			raise ValueError("Could not convert object to mesh")

		indices = []
		for face in me.tessfaces:
			if(len(face.vertices) == 3):
				indices.extend(face.vertices)
			else:
				indices.extend([face.vertices[0], face.vertices[1], face.vertices[2]])
				indices.extend([face.vertices[2], face.vertices[3], face.vertices[0]])

		positions = []
		normals = []
		matrix = obj.matrix_world.copy()
		for pos in me.vertices:
			positions.extend(matrix * pos.co)

			norm4 = pos.normal.to_4d()
			norm4 = matrix * norm4
			normals.extend(norm4.to_3d())

		bpy.data.meshes.remove(me)

	var_name = os.path.basename(filepath).replace(".js", "").replace(".", "_")
	file = open(filepath, "w")
	file.write("var src_" + var_name + " = { ")
	file.write("\"positions\": [")
	file.write(",".join(map(str, positions)))
	file.write("], \"normals\": [")
	file.write(",".join(map(str, normals)))
	file.write("], \"draw\": [")
	file.write(",".join(map(str, indices)))
	file.write("] }; ")
	file.write("var " + var_name + " = null;")
	file.close()

class JSExporter(bpy.types.Operator, ExportHelper):
	bl_idname = "export_mesh.js"
	bl_label = "Export JavaScript"

	filename_ext = ".js"
	filter_glob = StringProperty(default="*.js", options={'HIDDEN'})

	def execute(self, context):
		write(self.filepath)

		return {'FINISHED'}

def menu_export(self, context):
	self.layout.operator(JSExporter.bl_idname, text="JavaScript (.js)")

def register():
	bpy.utils.register_module(__name__)

	bpy.types.INFO_MT_file_export.append(menu_export)

def unregister():
	bpy.utils.unregister_module(__name__)

	bpy.types.INFO_MT_file_export.remove(menu_export)

if __name__ == "__main__":
	register()

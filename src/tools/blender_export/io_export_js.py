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

# Main export logic
def write(filepath, include_normals, smooth_normals):
	scene = bpy.context.scene

	# Requires exactly one selected object
	if len(bpy.context.selected_objects) != 1:
		raise AssertionError("Please select one object")
	obj = bpy.context.selected_objects[0]

	# Convert selected object to mesh (temporary)
	mesh = obj.to_mesh(scene, True, "PREVIEW")
	if mesh is None:
		raise ValueError("Could not convert object to mesh")

	# Get the current world matrix to transform exported data
	matrix = obj.matrix_world.copy()

	# TODO: support multiple materials
	# TODO: support all UV layers
	# Find the last active UV layer
	active_uv = []
	for layer in mesh.tessface_uv_textures:
		if layer.active:
			active_uv = layer.data

	# Build per-face lists
	indices = []
	face_normals = []
	face_uvs = []
	# Loop all tesselation faces by index
	for iFace in range(len(mesh.tessfaces)):
		face = mesh.tessfaces[iFace]

		# Transform face normal to world coords
		world_norm = face.normal.to_4d()
		world_norm = matrix * world_norm
		world_norm = world_norm.to_3d()

		# Supports triangles and quads
		if len(face.vertices) == 3: # Already a triangle
			# Append vertex indices
			indices.extend(face.vertices)
			# Append face normal
			face_normals.extend(world_norm)
			# Append face UVs if active
			if len(active_uv) > 0:
				face_uvs.extend(active_uv[iFace].uv1)
				face_uvs.extend(active_uv[iFace].uv2)
				face_uvs.extend(active_uv[iFace].uv3)
		else: # Triangulate quad
			# Append vertex indices (triangulate quad)
			indices.extend([face.vertices[0], face.vertices[1], face.vertices[2]])
			indices.extend([face.vertices[0], face.vertices[2], face.vertices[3]])
			# Append face normal twice (same for both triangles)
			face_normals.extend(world_norm)
			face_normals.extend(world_norm)
			# Append face UVs if active (triangulate quad)
			if len(active_uv) > 0:
				face_uvs.extend(active_uv[iFace].uv1)
				face_uvs.extend(active_uv[iFace].uv2)
				face_uvs.extend(active_uv[iFace].uv3)
				face_uvs.extend(active_uv[iFace].uv1)
				face_uvs.extend(active_uv[iFace].uv3)
				face_uvs.extend(active_uv[iFace].uv4)

	# Build per-vertex lists
	positions = []
	vert_normals = []
	# Loop all vertices
	for pos in mesh.vertices:
		# Append the position in world coords
		positions.extend(matrix * pos.co)

		# Append the vertex normal in world coords
		norm4 = pos.normal.to_4d()
		norm4 = matrix * norm4
		vert_normals.extend(norm4.to_3d())

	# Flip texture V coords for OpenGL
	for i in range(1, len(face_uvs), 2):
		face_uvs[i] = 1 - face_uvs[i]

	# Destroy temporary mesh
	bpy.data.meshes.remove(mesh)

	# Open output file
	file = open(filepath, "w")

	# Source object
	var_name = os.path.basename(filepath).replace(".js", "").replace(".", "_")
	file.write("var src_" + var_name + " = { ")

	# Vertex positions (3 values per vertex)
	file.write("\"positions\": [")
	file.write(",".join(["{0:.6g}".format(num) for num in positions]))

	if include_normals:
		# Check normal mode
		if smooth_normals:
			# Vertex normals (3 values per vertex)
			file.write("], \"vert_normals\": [")
			file.write(",".join(["{0:.3g}".format(num) for num in vert_normals]))
		else:
			# Face normals (3 values per face)
			file.write("], \"face_normals\": [")
			file.write(",".join(["{0:.3g}".format(num) for num in face_normals]))

	if len(face_uvs) > 0:
		# Face UVs (6 values per face)
		file.write("], \"face_uvs\": [")
		file.write(",".join(["{0:.3g}".format(num) for num in face_uvs]))

	# Vertex index list (3 values per face)
	file.write("], \"draw\": [")
	file.write(",".join(map(str, indices)))
	file.write("] };\n")

	# Model object placeholder
	file.write("var mdl_" + var_name + " = null;\n")

	file.close()

class JSExporter(bpy.types.Operator, ExportHelper):
	bl_idname = "export_mesh.js"
	bl_label = "Export JavaScript"

	filename_ext = ".js"
	filter_glob = StringProperty(default="*.js", options={'HIDDEN'})

	include_normals = BoolProperty(
		name="Include Normals",
		description="Include normals in export",
		default=True
		)
	smooth_normals = BoolProperty(
		name="Smooth Normals",
		description="Per-vertex smoothed normals",
		default=True
		)

	def execute(self, context):
		write(self.filepath, self.include_normals, self.smooth_normals)

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

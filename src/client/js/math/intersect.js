//Find the intersection point of a line with a plane
// Returns the scaled distance along the line, or false
function intersectLinePlane(lineBase, lineDirection, planeNormal, planeD)
{
	planeNormal = planeNormal.normalize();
	var den = planeNormal.dot(lineDirection);
	if(Math.abs(den) > 0)
	{
		var p = (-planeD - planeNormal.dot(lineBase)) / den;
		return p;
	}
	return null;
}

//Find the nearest intersection of a line with a cylinder
// Returns the scaled distance along the line, or false
function intersectLineCylinder(lineBase, lineDirection, cylinderStart, cylinderEnd, cylinderRadius)
{
	//Determine cylinder length
	var cLen = cylinderEnd.sub(cylinderStart).len();

	//Create a rotation matrix to align the cylinder to the Z-axis
	var cDir = cylinderEnd.sub(cylinderStart);
	var zAxis = new vec3(0, 0, 1);
	var vRot = cDir.cross(zAxis).normalize();
	var trans = mat4.rotate(vRot, cDir.angle(zAxis));

	//de-rotate (cylinder is now parallel to Z axis)
	var cStart = cylinderStart;
	var lStart = lineBase;
	var lEnd = lineBase.add(lineDirection);
	lStart = trans.transform(lStart);
	lEnd = trans.transform(lEnd);
	cStart = trans.transform(cStart);

	//de-translate (cylinder is now based at the origin)
	lStart = lStart.sub(cStart);
	lEnd = lEnd.sub(cStart);
	var dx = lEnd.x - lStart.x;
	var dy = lEnd.y - lStart.y;
	var dz = lEnd.z - lStart.z;

	var results = [];

	//Check for cylinder body intersection
	var D = lStart.x * lEnd.y - lEnd.x * lStart.y;
	var disc = cylinderRadius * cylinderRadius * (dx * dx + dy * dy) - D * D;
	if(disc > 0)
	{
		var x1 = (D * dy + dx * Math.sqrt(disc)) / (dx * dx + dy * dy);
		var x2 = (D * dy - dx * Math.sqrt(disc)) / (dx * dx + dy * dy);
		var u1 = (x1 - lStart.x) / dx;
		var u2 = (x2 - lStart.x) / dx;
		var z1 = lStart.z + u1 * dz;
		if(z1 >= 0 && z1 <= cLen)
		{
			results.push(u1);
		}
		var z2 = lStart.z + u2 * dz;
		if(z2 >= 0 && z2 <= cLen)
		{
			results.push(u2);
		}
	}

	//Check for cylinder cap intersection
	var u3 = (0 - lStart.z) / dz;
	var u4 = (cLen - lStart.z) / dz;
	if(Math.sqrt(Math.pow(lStart.x + u3 * dx, 2) + Math.pow(lStart.y + u3 * dy, 2)) <= cylinderRadius)
	{
		results.push(u3);
	}
	if(Math.sqrt(Math.pow(lStart.x + u4 * dx, 2) + Math.pow(lStart.y + u4 * dy, 2)) <= cylinderRadius)
	{
		results.push(u4);
	}

	//Return the earliest intersection
	if(results.length > 0)
	{
		return Math.min.apply(Math, results);
	}
	return null;
}

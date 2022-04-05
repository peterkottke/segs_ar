import bpy,os
import json
from mathutils import Vector, Matrix, Quaternion

root = r"C:\Users\peter.kottke\gitlab\tunnel_ar\public\meshes"
for i in range(1,9):
    bpy.ops.import_scene.obj(filepath=os.path.join(root, f"S{i}_RH.obj"), axis_forward="Y", axis_up="Z")


with open(r"C:\Users\peter.kottke\gitlab\tunnel_ar\src\segs_block_rotations.json") as fin:
    obj_rots = json.load(fin)
    
for key, rotations in obj_rots.items():
    print(key)
#    print(rotations)

    for obj in bpy.data.objects:
        if f"{key}_RH" in obj.name:
            for i, rotation in enumerate(rotations):
                if i > 100:
                    break
                
                new_obj = obj.copy()
                new_obj.name = f"{key}_dupe_{i}"
                new_obj.location += Vector([rotation['dx'], rotation['dy'], rotation['dz']])
                bpy.context.collection.objects.link(new_obj)
                quat = Quaternion(Vector([rotation['rw'], rotation['rx'], rotation['ry'], rotation['rz']]))
                quat = Quaternion(Vector([rotation['rx'], rotation['ry'], rotation['rz'], rotation['rw']]))
                length = 0
                for q in ['rw', 'rx', 'ry', 'rz']:
                    length += rotation[q]**2
                    
                print(length)
                new_obj.rotation_mode = "QUATERNION"
                new_obj.rotation_quaternion = quat
                
        
#        print(obj_name.name)

#print(bpy.data)
#    bpy.ops.export_scene.obj(filepath=f,use_materials=False)
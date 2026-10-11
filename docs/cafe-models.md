# Adding a Blender model to the café

The café renders built-in toon pieces until a model file exists. To
replace a piece with your own model:

1. **Model in Blender** with simple shapes. Real-world scale (1 unit =
   1 metre). Apply all transforms (Ctrl+A → All Transforms). Plain colours
   or one texture per material are enough; the café adds the toon shading
   and ink outlines itself.
2. **Match the layout.** The room spans x −7…7 and z 0…−9.5 (front door at
   z 0, back doorway to the roastery at z −9.5), ceiling at y 4. The roastery behind the back doorway spans x −4…4 and z −9.5…−14. The brew
   bar counter stands around x 5.6, z −3. Keep the origin at the world
   origin so the model lands in place.
3. **Export** as glTF Binary (`.glb`), with "Apply Modifiers" on, and no
   cameras or lights.
4. **Compress** (keeps the whole café under about 5 MB):
   Run these commands from the repo root.

       npm run models:optimize -- room.glb public/models/room.glb --compress meshopt --texture-compress webp --texture-size 1024

   A file over about 2 MB after this usually has textures that are too
   large; resize them to 1024 px or less.
5. **Register** it in `lib/cafe/models.ts`:

       export const MODELS: Partial<Record<ModelName, string>> = { room: "/models/room.glb" };

   Names available: `room` (walls, floor, ceiling, lamps) and `brew-bar`
   (counter and espresso machine). Animated or skinned meshes are shown in
   their rest pose.
6. **Check** `npm run dev` → `/cafe`. If the file is missing or broken, the
   built-in piece shows and the console logs a `[cafe]` warning.

Keep `.blend` source files out of the repo.

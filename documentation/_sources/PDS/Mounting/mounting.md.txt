# Mounting position

To ensure optimal performance of the 3D ToF cameras, we recommend specific mounting positions depending on the intended use case.

## General recommendation

- Mount the cameras 20 cm to 30 cm away from the forklift’s fork tines and make sure that pallet pockets/racks are not obstructed by fork tines.
- Position the cameras between the fork tines to minimize stray light reflections and optimize visibility.
- By default, PDS operates in the `standard_range2m` mode with a 1 meter offset, resulting in an approximate measurement range of 0.97 m to 3.39 m. This configuration is designed to minimize potential stray light artifacts caused by the forklift tines.
The measurement range can be adjusted based on the length of the forklift tines and the specific use case to ensure optimal performance.


## For `getRack` use case

- If the `GetRack` command is intended to be used, we recommend mounting the cameras below the fork tines at the suggested height. This ensures that the cameras are not obscured by the pallet load after picking it up.
- Adding a mechanical moving part for the camera mount is advisable. This mechanism allows the camera to move up when the fork tines are lowered to the ground, protecting the camera from potential damage.

## For `getPallet` use case only

If the `getPallet` command is the only intended use, the camera can alternatively be mounted above the fork tines. This position simplifies the setup.

# Intrinsic calibration models

Every camera is individually calibrated in production. We use two different models depending on the field of view of the camera.

## Fisheye model

This applies to the wide opening angle (O3R225) cameras. For these cameras, we use the fisheye distortion model as described below.

### For unprojection: intrinsic calibration model
This model is used for converting pixel positions to 3D vectors. It corresponds to `modelID=2`. The following formulas show how to apply the model:

![Fish eye model for unprojection](resources/fisheye_unprojection.png)

Where
- $\left(\begin{array}{c}i_x \\ i_y\end{array}\right)$ are the input coordinates as integer numbers, in pixels,
- $v = \left(\begin{array}{c}v_x\\ v_y\\ v_z\end{array}\right)$ is the resulting 3D direction vector in the optical coordinate system,
- $f_x, f_y, m_x, m_y, \alpha, k_1, k_2, k_3, k_4, \theta^*_{max}$ are the model parameters obtained from the `modelParameters` array.

### For projection: inverse intrinsic calibration model
This model is used for converting directions given as 3D vectors to pixel position. This corresponds to `modelID=3`. The following formulas show how to apply the model:

![Fish eye model for projection](resources/fisheye_projection.png)

Where 
- $v = \left(\begin{array}{c}v_x\\ v_y\\ v_z\end{array}\right)$ is the input direction vector in the optical coordinate system,
- $\left(\begin{array}{c}i_x \\ i_y\end{array}\right)$ are the resulting image coordinates (the upper left pixel has coordinates $(0, 0)$),
- $f_x, f_y, m_x, m_y, \alpha, k_1, k_2, k_3, k_4, \theta_{max}$ are the model parameters obtained from the `modelParameters` array. 

## Bouguet model

### For unprojection: intrinsic calibration model
This model is used for converting pixel positions to 3D vectors. It corresponds to `modelID=0`. The following formulas show how to apply the model:

![Bouguet model for unprojection](resources/bouguet_unprojection.png)

Where
- $\left(\begin{array}{c}i_x \\ i_y\end{array}\right)$ are the input coordinates are integer numbers, in pixels,
- $v = \left(\begin{array}{c}v_x\\ v_y\\ v_z\end{array}\right)$ is the resulting 3D direction vector in the optical coordinate system,
- $f_x, f_y, m_x, m_y, \alpha, k_1, k_2, k_3, k_4, k_5$ are the model parameters obtained from the `modelParameters` array.

### For projection: inverse intrinsic calibration model
This model is used for converting directions given as 3D vectors to pixel position. This corresponds to `modelID=1`. The following formulas show how to apply the model:

![Bouguet model for projection](resources/bouguet_projection.png)

Where 
- $v = \left(\begin{array}{c}v_x\\ v_y\\ v_z\end{array}\right)$ is the input direction vector in the optical coordinate system,
- $\left(\begin{array}{c}i_x \\ i_y\end{array}\right)$ are the resulting image coordinates (the upper left pixel has coordinates $(0, 0)$),
- $f_x, f_y, m_x, m_y, \alpha, k_1, k_2, k_3, k_4, k_5$ are the model parameters obtained from the `modelParameters` array.
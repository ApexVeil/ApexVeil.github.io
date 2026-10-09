# Demonstration media provenance

The owner explicitly authorized publication of the original test photographs and processed results, including the original plate identifiers, on 2026-10-09. Only three aligned detail crops are published here. EXIF metadata is not included in the exported WebP assets.

- Original: actual photographed input crop.
- Custom: the previously validated plate_only RGBA P7+ replacement result, with perspective refinement and appearance adaptation.
- Blur: a Gaussian treatment of the original pixels inside a SAM3.1-visible plate mask, computed on the independent H20 environment.
- Mosaic: pixelation of the same masked original region.

The page is an interactive viewer of pre-rendered examples. The comparison slider does not invoke a remote model or represent live inference. These three examples do not establish robust performance across all images, occlusions or video shots. The interactive editor and video replacement remain in development.

The SAM-derived quadrilaterals in cases.json are normalized to each cropped image and are used only to visualize the selected surface.

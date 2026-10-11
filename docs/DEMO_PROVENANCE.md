# Demonstration media provenance

The owner explicitly authorized publication of the original test photographs and processed results, including the original plate identifiers, on 2026-10-09. The photographic examples use three aligned detail crops. EXIF metadata is not included in the exported WebP assets.

- Original: actual photographed input crop.
- Custom: the previously validated plate_only RGBA P7+ replacement result, with perspective refinement and appearance adaptation.
- Blur: a Gaussian treatment of the original pixels inside a SAM3.1-visible plate mask, computed on the independent H20 environment.
- Mosaic: pixelation of the same masked original region.

The page is an interactive viewer of pre-rendered examples. The comparison slider does not invoke a remote model or represent live inference. These three examples do not establish robust performance across all images, occlusions or video shots. The source repository includes a personal offline Studio; broad scene-quality validation is ongoing.

The SAM-derived quadrilaterals in cases.json are normalized to each cropped image and are used only to visualize the selected surface.


## Authorized video, 2026-10-11

The owner explicitly requested public demonstration of `RGB-SAM-ApexVeil-v2.mp4`.
The website serves that file unchanged as `assets/demos/video/rgb-sam-apexveil-v2.mp4`.

- SHA-256: `818eb312eb336b7fce11ce0f929266b2fd87ca12ad770efc2f480c2f3d486088`
- Size: 14,118,852 bytes; duration: 3.300 seconds; 30 fps; H.264 video + AAC audio.
- Frame: 3840 × 720, three aligned 1280 × 720 panels: RGB, native SAM 3.1 masks, ApexVeil replacement.
- The poster is the video frame at 1.35 seconds, resized to 1920 × 360; it is not a generated illustration.
- Playback is user-initiated, with no third-party player or tracking. The video is not advertised as live inference or as proof of universal quality.

This permission applies to the named video and derived poster, not other private evaluation media.

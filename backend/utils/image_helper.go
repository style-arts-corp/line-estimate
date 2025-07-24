package utils

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"image"
	"image/gif"
	"image/jpeg"
	"image/png"
	"strings"

	"golang.org/x/image/draw"
)

// ImageHelper provides utilities for image processing
type ImageHelper struct {
	maxWidth  float64
	maxHeight float64
}

// NewImageHelper creates a new ImageHelper instance
func NewImageHelper(maxWidth, maxHeight float64) *ImageHelper {
	return &ImageHelper{
		maxWidth:  maxWidth,
		maxHeight: maxHeight,
	}
}

// DecodeBase64Image decodes a base64 encoded image and returns the image data and format
func (h *ImageHelper) DecodeBase64Image(data string) ([]byte, string, error) {
	// Remove data URL prefix if present
	if strings.Contains(data, ",") {
		parts := strings.Split(data, ",")
		if len(parts) == 2 {
			data = parts[1]
		}
	}

	// Decode base64
	decoded, err := base64.StdEncoding.DecodeString(data)
	if err != nil {
		return nil, "", fmt.Errorf("failed to decode base64: %w", err)
	}

	// Detect image format
	format := h.detectImageFormat(decoded)
	if format == "" {
		return nil, "", fmt.Errorf("unsupported image format")
	}

	return decoded, format, nil
}

// ValidateImageFormat validates if the image format is supported
func (h *ImageHelper) ValidateImageFormat(format string) error {
	supportedFormats := []string{"jpeg", "jpg", "png", "gif", "webp"}
	for _, f := range supportedFormats {
		if strings.ToLower(format) == f {
			return nil
		}
	}
	return fmt.Errorf("unsupported image format: %s", format)
}

// ResizeImage resizes an image to fit within maxWidth and maxHeight while maintaining aspect ratio
func (h *ImageHelper) ResizeImage(data []byte, format string) ([]byte, error) {
	// Decode image
	img, _, err := image.Decode(bytes.NewReader(data))
	if err != nil {
		return nil, fmt.Errorf("failed to decode image: %w", err)
	}

	bounds := img.Bounds()
	width := float64(bounds.Dx())
	height := float64(bounds.Dy())

	// Calculate scale factor
	scaleW := h.maxWidth / width
	scaleH := h.maxHeight / height
	scale := scaleW
	if scaleH < scaleW {
		scale = scaleH
	}

	// Only resize if image is larger than max dimensions
	if scale >= 1.0 {
		return data, nil
	}

	// Calculate new dimensions
	newWidth := int(width * scale)
	newHeight := int(height * scale)

	// Create resized image
	dst := image.NewRGBA(image.Rect(0, 0, newWidth, newHeight))
	draw.BiLinear.Scale(dst, dst.Bounds(), img, bounds, draw.Over, nil)

	// Encode resized image
	var buf bytes.Buffer
	switch format {
	case "jpeg", "jpg":
		err = jpeg.Encode(&buf, dst, &jpeg.Options{Quality: 85})
	case "png":
		err = png.Encode(&buf, dst)
	case "gif":
		err = gif.Encode(&buf, dst, nil)
	default:
		return nil, fmt.Errorf("unsupported format for encoding: %s", format)
	}

	if err != nil {
		return nil, fmt.Errorf("failed to encode image: %w", err)
	}

	return buf.Bytes(), nil
}

// detectImageFormat detects the image format from the data
func (h *ImageHelper) detectImageFormat(data []byte) string {
	if len(data) < 4 {
		return ""
	}

	// Check magic numbers
	switch {
	case bytes.HasPrefix(data, []byte{0xFF, 0xD8, 0xFF}):
		return "jpeg"
	case bytes.HasPrefix(data, []byte{0x89, 0x50, 0x4E, 0x47}):
		return "png"
	case bytes.HasPrefix(data, []byte{0x47, 0x49, 0x46}):
		return "gif"
	case bytes.HasPrefix(data, []byte{0x52, 0x49, 0x46, 0x46}) && len(data) > 12 && bytes.Equal(data[8:12], []byte{0x57, 0x45, 0x42, 0x50}):
		return "webp"
	default:
		return ""
	}
}

// GetImageDimensions returns the dimensions of an image
func (h *ImageHelper) GetImageDimensions(data []byte) (int, int, error) {
	img, _, err := image.DecodeConfig(bytes.NewReader(data))
	if err != nil {
		return 0, 0, fmt.Errorf("failed to decode image config: %w", err)
	}
	return img.Width, img.Height, nil
}

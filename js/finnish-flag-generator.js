/**
 * Finnish Flag Vector Graphics Generator
 * Creates SVG-based Finnish flag graphics for boundary visualization
 */

class FinnishFlagGenerator {
    constructor() {
        this.flagWidth = 40; // Base width in pixels (10x larger)
        this.flagHeight = 30; // Base height in pixels (4:3 ratio)
        this.crossWidth = 5; // Width of the cross (10x larger)
        this.blueColor = '#003580'; // Finnish flag blue
        this.whiteColor = '#FFFFFF'; // White
    }

    /**
     * Generate SVG for Finnish flag
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} scale - Scale factor
     * @param {number} rotation - Rotation in degrees
     * @returns {string} SVG string
     */
    generateFlagSVG(x, y, scale = 1, rotation = 0) {
        const width = this.flagWidth * scale;
        const height = this.flagHeight * scale;
        const crossWidth = this.crossWidth * scale;
        
        // Calculate cross positions
        const horizontalCrossY = height / 2 - crossWidth / 2;
        const verticalCrossX = width / 2 - crossWidth / 2;
        
        const svg = `
            <svg x="${x}" y="${y}" width="${width}" height="${height}" 
                 transform="rotate(${rotation} ${x + width/2} ${y + height/2})"
                 style="overflow: visible;">
                <!-- White background -->
                <rect x="0" y="0" width="${width}" height="${height}" fill="${this.whiteColor}" stroke="none"/>
                
                <!-- Blue horizontal cross -->
                <rect x="0" y="${horizontalCrossY}" width="${width}" height="${crossWidth}" fill="${this.blueColor}"/>
                
                <!-- Blue vertical cross -->
                <rect x="${verticalCrossX}" y="0" width="${crossWidth}" height="${height}" fill="${this.blueColor}"/>
            </svg>
        `;
        
        return svg;
    }

    /**
     * Generate WebGL vertices for Finnish flag
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} scale - Scale factor
     * @param {number} rotation - Rotation in degrees
     * @returns {Object} WebGL data
     */
    generateFlagWebGL(x, y, scale = 1, rotation = 0) {
        const width = this.flagWidth * scale;
        const height = this.flagHeight * scale;
        const crossWidth = this.crossWidth * scale;
        
        // Convert rotation to radians
        const rad = (rotation * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        
        // Center point for rotation
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        
        // Rotate point helper
        const rotatePoint = (px, py) => {
            const dx = px - centerX;
            const dy = py - centerY;
            return {
                x: centerX + dx * cos - dy * sin,
                y: centerY + dx * sin + dy * cos
            };
        };
        
        // Generate vertices for horizontal cross
        const horizontalCrossY = y + height / 2 - crossWidth / 2;
        const horizontalCrossVertices = [
            rotatePoint(x, horizontalCrossY).x, rotatePoint(x, horizontalCrossY).y,
            rotatePoint(x + width, horizontalCrossY).x, rotatePoint(x + width, horizontalCrossY).y,
            rotatePoint(x, horizontalCrossY + crossWidth).x, rotatePoint(x, horizontalCrossY + crossWidth).y,
            
            rotatePoint(x + width, horizontalCrossY).x, rotatePoint(x + width, horizontalCrossY).y,
            rotatePoint(x + width, horizontalCrossY + crossWidth).x, rotatePoint(x + width, horizontalCrossY + crossWidth).y,
            rotatePoint(x, horizontalCrossY + crossWidth).x, rotatePoint(x, horizontalCrossY + crossWidth).y
        ];
        
        // Generate vertices for vertical cross
        const verticalCrossX = x + width / 2 - crossWidth / 2;
        const verticalCrossVertices = [
            rotatePoint(verticalCrossX, y).x, rotatePoint(verticalCrossX, y).y,
            rotatePoint(verticalCrossX + crossWidth, y).x, rotatePoint(verticalCrossX + crossWidth, y).y,
            rotatePoint(verticalCrossX, y + height).x, rotatePoint(verticalCrossX, y + height).y,
            
            rotatePoint(verticalCrossX + crossWidth, y).x, rotatePoint(verticalCrossX + crossWidth, y).y,
            rotatePoint(verticalCrossX + crossWidth, y + height).x, rotatePoint(verticalCrossX + crossWidth, y + height).y,
            rotatePoint(verticalCrossX, y + height).x, rotatePoint(verticalCrossX, y + height).y
        ];
        
        // Generate vertices for white background
        const backgroundVertices = [
            rotatePoint(x, y).x, rotatePoint(x, y).y,
            rotatePoint(x + width, y).x, rotatePoint(x + width, y).y,
            rotatePoint(x, y + height).x, rotatePoint(x, y + height).y,
            
            rotatePoint(x + width, y).x, rotatePoint(x + width, y).y,
            rotatePoint(x + width, y + height).x, rotatePoint(x + width, y + height).y,
            rotatePoint(x, y + height).x, rotatePoint(x, y + height).y
        ];
        
        return {
            background: {
                vertices: backgroundVertices,
                color: [1, 1, 1, 1] // White background
            },
            horizontalCross: {
                vertices: horizontalCrossVertices,
                color: [0, 0.21, 0.5, 1] // Finnish blue
            },
            verticalCross: {
                vertices: verticalCrossVertices,
                color: [0, 0.21, 0.5, 1] // Finnish blue
            }
        };
    }

    /**
     * Generate multiple flags along a path
     * @param {Array} pathPoints - Array of {lat, lng} points
     * @param {number} spacing - Distance between flags in meters
     * @param {number} scale - Scale factor for flags
     * @returns {Array} Array of flag data
     */
    generateFlagsAlongPath(pathPoints, spacing = 10, scale = 1) {
        const flags = [];
        
        if (pathPoints.length < 2) return flags;
        
        for (let i = 0; i < pathPoints.length - 1; i++) {
            const current = pathPoints[i];
            const next = pathPoints[i + 1];
            
            // Calculate distance between points
            const distance = this.calculateDistance(current, next);
            const numFlags = Math.floor(distance / spacing);
            
            // Generate flags along the line segment
            for (let j = 0; j <= numFlags; j++) {
                const t = j / numFlags;
                const lat = current.lat + (next.lat - current.lat) * t;
                const lng = current.lng + (next.lng - current.lng) * t;
                
                // Calculate rotation based on direction
                const rotation = this.calculateBearing(current, next);
                
                flags.push({
                    lat,
                    lng,
                    scale,
                    rotation,
                    id: `flag_${i}_${j}`
                });
            }
        }
        
        return flags;
    }

    /**
     * Calculate distance between two points in meters
     * @param {Object} point1 - {lat, lng}
     * @param {Object} point2 - {lat, lng}
     * @returns {number} Distance in meters
     */
    calculateDistance(point1, point2) {
        const R = 6371000; // Earth's radius in meters
        const dLat = (point2.lat - point1.lat) * Math.PI / 180;
        const dLng = (point2.lng - point1.lng) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    /**
     * Calculate bearing between two points
     * @param {Object} point1 - {lat, lng}
     * @param {Object} point2 - {lat, lng}
     * @returns {number} Bearing in degrees
     */
    calculateBearing(point1, point2) {
        const dLng = (point2.lng - point1.lng) * Math.PI / 180;
        const lat1 = point1.lat * Math.PI / 180;
        const lat2 = point2.lat * Math.PI / 180;
        
        const y = Math.sin(dLng) * Math.cos(lat2);
        const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
        
        return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
    }

    /**
     * Generate boundary polygon with flags
     * @param {Array} boundaryPoints - Array of {lat, lng} points forming a polygon
     * @param {number} flagSpacing - Spacing between flags in meters
     * @param {number} scale - Scale factor for flags
     * @returns {Object} Boundary data with flags
     */
    generateBoundaryWithFlags(boundaryPoints, flagSpacing = 15, scale = 1) {
        const flags = [];
        
        // Add flags along each edge of the polygon
        for (let i = 0; i < boundaryPoints.length; i++) {
            const current = boundaryPoints[i];
            const next = boundaryPoints[(i + 1) % boundaryPoints.length];
            
            const edgeFlags = this.generateFlagsAlongPath([current, next], flagSpacing, scale);
            flags.push(...edgeFlags);
        }
        
        return {
            boundary: boundaryPoints,
            flags: flags,
            center: this.calculatePolygonCenter(boundaryPoints)
        };
    }

    /**
     * Calculate center point of polygon
     * @param {Array} points - Array of {lat, lng} points
     * @returns {Object} Center point {lat, lng}
     */
    calculatePolygonCenter(points) {
        let lat = 0, lng = 0;
        points.forEach(point => {
            lat += point.lat;
            lng += point.lng;
        });
        return {
            lat: lat / points.length,
            lng: lng / points.length
        };
    }
}

// Make it globally available
window.FinnishFlagGenerator = FinnishFlagGenerator;

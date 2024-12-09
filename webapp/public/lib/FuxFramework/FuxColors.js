const FuxColors = {
    adjustBrightness: (hex, steps) => {
        // Steps should be between -255 and 255. Negative = darker, positive = lighter
        steps = Math.max(-255, Math.min(255, steps));

        // Normalize into a six character long hex string
        hex = hex.replace('#', '');
        if (hex.length === 3) {
            hex = hex.substr(0, 1).repeat(2) + hex.substr(1, 1).repeat(2) + hex.substr(2, 1).repeat(2);
        }

        // Split into three parts: R, G and B
        const color_parts = hex.match(/.{1,2}/g)
        let _return = '#';

        color_parts.map(color => {
            color = parseInt(color, 16);
            color = Math.max(0, Math.min(255, color + steps));
            _return += color.toString(16).padStart(2, "0");
        });

        return _return;

    },

    hexToRgb: (hex) => {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },

    RGBToHSL: ({r, g, b}) => {
        // Make r, g, and b fractions of 1
        r /= 255.0;
        g /= 255.0;
        b /= 255.0;

        maxC = Math.max(r, g, b);
        minC = Math.min(r, g, b);

        l = (maxC + minC) / 2.0;

        if (maxC == minC) {
            s = 0;
            h = 0;
        } else {
            if (l < .5) {
                s = (maxC - minC) / (maxC + minC);
            } else {
                s = (maxC - minC) / (2.0 - maxC - minC);
            }
            if (r == maxC)
                h = (g - b) / (maxC - minC);
            if (g == maxC)
                h = 2.0 + (b - r) / (maxC - minC);
            if (b == maxC)
                h = 4.0 + (r - g) / (maxC - minC);

            h = h / 6.0;
        }

        h = parseInt(Math.round(255.0 * h));
        s = parseInt(Math.round(255.0 * s));
        l = parseInt(Math.round(255.0 * l));

        return {hue: h, saturation: s, lightness: l};
    }

}
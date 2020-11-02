const approvedRatios = ['1:1', '4:5', '9:16'];

export function imageChecker(width: number, height: number) {
    function gcd (a:number, b: number) {
        return (b == 0) ? a : gcd (b, a%b);
    }

    const w = width;
    const h = height;
    const r = gcd (w, h);
    const aspect = `${w/r}:${h/r}`

    let m = {
        approved: false,
        message: null,
        resize: false,
        resizeWidth: null,
        resizeHeight: null,
        aspect
    };

    switch (aspect) {
        case '1:1':
            m.approved = true;
            if (width > 1080) {
                m.resize = true
            } else if (width < 1080) {
                m.resize = true;
                m.message = "This image is less than the recommended size of 1080x1080";
                m.resizeWidth = 1080;
                m.resizeHeight = 1080;
            }
        case '4:5':
            m.approved = true;
            if (width > 1080) {
                m.resize = true
            } else if (width < 1080) {
                m.resize = true;
                m.message = "This image is less than the recommended size of 1080x1350";
                m.resizeWidth = 1080;
                m.resizeHeight = 1350;
            }
        case '9:16':
            m.approved = true;
            if (width > 1080) {
                m.resize = true
            } else if (width < 1080) {
                m.resize = true;
                m.message = "This image is less than the recommended size of 1080x1920";
                m.resizeWidth = 1080;
                m.resizeHeight = 1920;
            }
        default:
            m.message = "You will need to crop this image before uploading (next step)."
    }

    return m

}

export function isImage(uri) {
    return uri.substr(5, 5) === "image"
}

export function isVideo(uri) {
    return uri.substr(5, 5) === "video"
}
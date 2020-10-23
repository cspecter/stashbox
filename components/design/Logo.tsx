export default function (props) {

    function logo() {
        switch (props.tone) {
            case "white":
                return "/stashbox_logo_white.svg"
                break;
            case "color":
                return "/stashbox_logo_color.svg"
                break;
            case "black":
                return "/stashbox_logo_black.svg"
                break;
            default:
                return "/stashbox_logo_white.svg"
        }
    }

    return (
        <img src={logo()} alt="logo" width={props.width || "auto"} height={props.height || "auto"}/>
    )
}
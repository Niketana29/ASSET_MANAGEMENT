

export default function PasswordStrengthBar({ password }) {

    const getStrength = () => {

        if (!password)
            return "Password is required";

        if (password.length < 8)
            return "Weak";

        if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password)) {

            return "Strong";
        }

        return "Medium";
    };

    const strength = getStrength();

    const getColor = () => {

        if (strength === "Strong")
            return "green";

        if (strength === "Medium")
            return "orange";

        return "red";
    };

    return(
        <div className = "mt-2">
            <small>
                Password Strength:{" "}
                <span style = {{color : getColor(), fontWeight : "bold"}}>
                    {strength}
                </span>
            </small>
        </div>
    );

}
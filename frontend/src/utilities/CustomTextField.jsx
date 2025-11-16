import { InputAdornment, FormHelperText, Input } from "../shared/Imports"

const CustomTextField = ({ name, label, type, value, handleChange, adornment, required, id, helperText, placeholder, isMultiline = false, rows = 0, size = "middle" }) => {
    const { TextArea, Password } = Input;
    return (
        <>
            {
                !isMultiline ? (
                    name === "password" ? (
                        <div>
                            <Password
                                size={size}
                                required={required}
                                id={id}
                                label={label}
                                placeholder={placeholder}
                                value={value}
                                onChange={handleChange}
                                type={type}
                                name={name}
                                prefix={<InputAdornment position="start">{adornment}</InputAdornment>}
                                variant="outlined"
                            />
                            {helperText && (
                                <FormHelperText component={"div"} className=" text-textSecondary text-sm">
                                    {Array.isArray(helperText) ? (
                                        <div>
                                            <ul>
                                                {helperText.map((point, index) => (
                                                    <li key={index}>{point}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        <span>{helperText}</span>
                                    )}
                                </FormHelperText>
                            )}
                        </div>
                    ) : (
                        <Input
                            size={size}
                            required={required}
                            id={id}
                            label={label}
                            placeholder={placeholder}
                            type={type}
                            name={name}
                            value={value}
                            onChange={handleChange}
                            variant="outlined"
                            prefix={<InputAdornment position="start">{adornment}</InputAdornment>}
                        />
                    )
                ) : (
                    <TextArea
                        size={size}
                        required={required}
                        id={id}
                        label={label}
                        rows={rows}
                        placeholder={placeholder}
                        value={value}
                        onChange={handleChange}
                        type={type}
                        name={name}
                        variant="outlined"
                    />
                )
            }
        </>
    )
};

export {
    CustomTextField
}
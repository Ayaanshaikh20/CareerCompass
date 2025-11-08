import { FormControl, InputLabel, OutlinedInput, InputAdornment, FormHelperText } from "../shared/Imports"

const CustomTextField = ({ name, label, type, value, handleChange, adornment, required, id, helperText }) => {
    return (
        <FormControl fullWidth variant="outlined">
            <InputLabel>{label}</InputLabel>
            <OutlinedInput
                id={id}
                label={label}
                type={type}
                startAdornment={<InputAdornment position="start">{adornment}</InputAdornment>}
                fullWidth
                size="small"
                required={required}
                name={name}
                value={value}
                onChange={handleChange}
            />
            {helperText && (
                <FormHelperText component={"div"} className=" text-textSecondary text-sm">
                    {Array.isArray(helperText) ? (
                        <div>
                            <ul className="list-disc">
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
        </FormControl>
    )
};

export {
    CustomTextField
}
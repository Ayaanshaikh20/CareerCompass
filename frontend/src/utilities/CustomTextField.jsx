import { FormHelperText } from "../shared/Imports"

const CustomTextField = ({ name, label, type, value, handleChange, adornment, required, id, helperText, placeholder, isMultiline = false, rows = 0, size = "middle" }) => {
    return (
        <>
            {!isMultiline ? (
                name === "password" ? (
                    <div>
                        <input
                            required={required}
                            id={id}
                            placeholder={placeholder}
                            value={value}
                            onChange={handleChange}
                            type={type}
                            name={name}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        />
                        {helperText && (
                            <FormHelperText component={"div"} className="text-gray-600 dark:text-gray-400 text-sm">
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
                    <input
                        required={required}
                        id={id}
                        placeholder={placeholder}
                        type={type}
                        name={name}
                        value={value}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                )
            ) : (
                <textarea
                    required={required}
                    id={id}
                    rows={rows}
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                    name={name}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
                />
            )}
        </>
    )
};

export {
    CustomTextField
}
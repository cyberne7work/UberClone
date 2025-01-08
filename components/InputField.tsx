import React, { useRef } from "react";
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  View,
  Text,
  TextInput,
  Image,
  Platform,
  Keyboard,
  TextInputProps,
  StyleSheet,
} from "react-native";

interface InputFieldProps extends TextInputProps {
  label: string;
  labelStyle?: object;
  placeholder?: string;
  secureTextEntry?: boolean;
  containerStyle?: object;
  inputStyle?: object;
  iconStyle?: object;
  icon?: any;
  order?: number; // New order prop for focus management
  onSubmitEditing?: () => void; // Optional for handling tab order
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  labelStyle,
  placeholder,
  secureTextEntry = false,
  containerStyle,
  inputStyle,
  iconStyle,
  icon,
  order,
  onSubmitEditing,
  ...props
}) => {
  const inputRef = useRef<TextInput>(null);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoiding}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container, containerStyle]}>
          <Text style={[styles.label, labelStyle]}>{label}</Text>
          <View style={[styles.inputContainer]}>
            {icon && <Image source={icon} style={[styles.icon, iconStyle]} />}
            <TextInput
              ref={inputRef}
              style={[styles.input, inputStyle]}
              placeholder={placeholder}
              placeholderTextColor="#A0A0A0" // Ensuring placeholder is visible
              secureTextEntry={secureTextEntry}
              returnKeyType="next"
              onSubmitEditing={onSubmitEditing}
              {...props}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoiding: {
    width: "100%",
  },
  container: {
    marginVertical: 8,
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontFamily: "JakartaRegular",
    color: "black",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#f5f5f5",
    paddingHorizontal: 10,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 17,
    fontFamily: "JakartaSemiBold",
    paddingVertical: 15,
    paddingHorizontal: 4,
    textAlign: "left",
  },
});

export default InputField;

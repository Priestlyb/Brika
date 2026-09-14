/**
 * -----------------------------------------------------------------------------
 * File: src/components/files/FilePickerButton.tsx
 * -----------------------------------------------------------------------------
 * Brika File Picker Button
 *
 * Responsibilities:
 *
 * - Open the native/web document picker.
 * - Restrict selection to supported Brika file types.
 * - Allow a single file to be selected.
 * - Convert the selected document into a File object.
 * - Return the selected File to the parent component.
 * - Expose disabled/loading state.
 *
 * This component does NOT:
 *
 * - Upload files.
 * - Manage upload state.
 * - Call the API directly.
 * - Manage file conversion.
 * -----------------------------------------------------------------------------
 */

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";

import {
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  SUPPORTED_FILE_EXTENSIONS,
} from "@/constants/file.constants";
import { colors } from "@/constants/theme/colors";
import { radius } from "@/constants/theme/radius";
import { spacing } from "@/constants/theme/spacing";

/**
 * -----------------------------------------------------------------------------
 * Props
 * -----------------------------------------------------------------------------
 */

export interface FilePickerButtonProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
}

/**
 * -----------------------------------------------------------------------------
 * Supported MIME Types
 * -----------------------------------------------------------------------------
 *
 * Expo Document Picker accepts MIME types through `type`.
 *
 * `application/octet-stream` is included so platforms that do not expose
 * specialized CAD MIME types can still display supported files.
 */

const DOCUMENT_PICKER_TYPES = [
  "application/acad",
  "application/x-acad",
  "application/autocad",
  "application/dwg",
  "application/dxf",
  "application/x-dxf",
  "application/step",
  "application/step-file",
  "application/x-step",
  "model/step",
  "model/step+zip",
  "application/sla",
  "application/vnd.ms-pki.stl",
  "model/stl",
  "application/x-stl",
  "application/pdf",
  "application/octet-stream",
];

/**
 * -----------------------------------------------------------------------------
 * Helpers
 * -----------------------------------------------------------------------------
 */

function getFileExtension(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf(".");

  if (lastDotIndex === -1) {
    return "";
  }

  return fileName.slice(lastDotIndex + 1).toLowerCase();
}

function isSupportedExtension(fileName: string): boolean {
  const extension = getFileExtension(fileName);

  return (SUPPORTED_FILE_EXTENSIONS as readonly string[]).includes(extension);
}

function getFileFromAsset(
  asset: DocumentPicker.DocumentPickerAsset,
): File | null {
  /**
   * On web, Expo Document Picker can expose the native File directly.
   */
  if (asset.file instanceof File) {
    return asset.file;
  }

  return null;
}

async function convertAssetToFile(
  asset: DocumentPicker.DocumentPickerAsset,
): Promise<File> {
  const existingFile = getFileFromAsset(asset);

  if (existingFile) {
    return existingFile;
  }

  /**
   * Native platforms provide a local URI rather than a browser File.
   *
   * Fetching the URI gives us a Blob which can be converted into a File.
   */
  const response = await fetch(asset.uri);

  if (!response.ok) {
    throw new Error("The selected file could not be read.");
  }

  const blob = await response.blob();

  return new File([blob], asset.name, {
    type: asset.mimeType ?? blob.type ?? "application/octet-stream",
    lastModified: Date.now(),
  });
}

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export function FilePickerButton({
  onFileSelected,
  disabled = false,
  loading = false,
  label = "Choose file",
}: FilePickerButtonProps) {
  const isDisabled = disabled || loading;

  const handlePress = async (): Promise<void> => {
    if (isDisabled) {
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: DOCUMENT_PICKER_TYPES,
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets[0];

      if (!asset) {
        return;
      }

      /**
       * Validate extension before passing the file
       * to the upload layer.
       */
      if (!isSupportedExtension(asset.name)) {
        throw new Error(
          `Unsupported file type. Supported formats: ${SUPPORTED_FILE_EXTENSIONS.join(
            ", ",
          )}.`,
        );
      }

      /**
       * Validate size before upload.
       */
      if (typeof asset.size === "number" && asset.size > MAX_FILE_SIZE_BYTES) {
        throw new Error(
          `File is too large. Maximum file size is ${MAX_FILE_SIZE_MB} MB.`,
        );
      }

      const file = await convertAssetToFile(asset);

      if (file.size > MAX_FILE_SIZE_BYTES) {
        throw new Error(
          `File is too large. Maximum file size is ${MAX_FILE_SIZE_MB} MB.`,
        );
      }

      onFileSelected(file);
    } catch (error) {
      /**
       * The component intentionally does not own an error state.
       *
       * Parents can provide their own error handling through the
       * upload flow. We rethrow so the caller can handle picker
       * failures if required.
       */
      console.error("[Brika File Picker] Failed to select file:", error);
    }
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{
        disabled: isDisabled,
        busy: loading,
      }}
      disabled={isDisabled}
      onPress={() => {
        void handlePress();
      }}
      style={({ pressed }) => [
        styles.button,
        isDisabled && styles.buttonDisabled,
        pressed && !isDisabled && styles.buttonPressed,
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="small" />
        ) : (
          <Text style={styles.icon}>+</Text>
        )}

        <Text style={[styles.label, isDisabled && styles.labelDisabled]}>
          {loading ? "Selecting..." : label}
        </Text>
      </View>
    </Pressable>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------
 */

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.medium,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.primary,
  },

  buttonPressed: {
    opacity: 0.75,
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },

  icon: {
    fontSize: 20,
    lineHeight: 20,
    fontWeight: "600",
    color: colors.text.primary,
  },

  label: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",
    color: colors.text.primary,
  },

  labelDisabled: {
    color: colors.text.secondary,
  },
});

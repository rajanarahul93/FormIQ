import { ThemeProvider } from "@/components/theme-provider";
import { Layout } from "@/components/layout";
import { FormBuilderDnd } from "@/components/form-builder/form-builder-dnd";
import { FormCanvas } from "@/components/form-builder/form-canvas";
import { FieldConfigPanel } from "@/components/form-builder/field-config-panel";
import { LivePreview } from "@/components/form-preview/live-preview";
import { Toaster } from "@/components/ui/toaster";
import { useFormStore } from "@/store/form-store";
import { useLocalStorage } from "@/hooks/use-local-storage";

function App() {
  const { selectedFieldId } = useFormStore();
  useLocalStorage(); // Enable auto-save functionality

  return (
    <ThemeProvider defaultTheme="dark" storageKey="formiq-theme">
      <FormBuilderDnd>
        <Layout>
          <div className="flex h-full">
            <FormCanvas />
            {selectedFieldId ? <FieldConfigPanel /> : <LivePreview />}
          </div>
        </Layout>
      </FormBuilderDnd>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
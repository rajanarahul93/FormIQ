# FormIQ Pro - Advanced Form Builder

A premium, frontend-only form builder and testing playground built with modern web technologies. Create, customize, and export professional forms with drag-and-drop simplicity.


##  Features

###  **Dynamic Form Building**
- **Drag & Drop Interface** - Intuitive field placement from sidebar to canvas
- **10+ Field Types** - Text, Email, Phone, Password, Date, Number, Textarea, Select, Checkbox, Radio
- **Visual Form Builder** - Real-time form construction with sortable fields
- **Field Reordering** - Drag fields to reorganize form structure

### **Advanced Configuration**
- **Field Properties Editor** - Customize labels, placeholders, validation rules
- **Conditional Logic** - Show/hide fields based on other field values
- **Validation Rules** - Required fields, min/max length, custom regex patterns
- **Bulk Operations** - Edit multiple fields simultaneously

###  **Smart Features**
- **Auto-fill with Fake Data** - Populate forms with realistic sample data using Faker.js
- **Form Templates** - 5 pre-built professional form templates
- **Undo/Redo System** - 50-step history with full state management
- **Auto-save** - Local storage persistence every 30 seconds

###  **Live Preview & Testing**
- **Interactive Preview** - Test forms with real validation and submission
- **Responsive Design** - Preview in desktop, tablet, and mobile modes
- **Form Validation** - Real-time validation with error messages

###  **Export Options**
- **JSON Export** - Download form configuration
- **HTML Export** - Complete standalone HTML file with styling
- **React Component** - Generate ready-to-use React components
- **Copy to Clipboard** - Quick sharing of form configurations

###  **Professional UI/UX**
- **Dark/Light Theme** - System-aware theme switching with persistence
- **Modern Design** - Clean interface using Tailwind CSS and Shadcn UI
- **Responsive Layout** - Works perfectly on all device sizes
- **Toast Notifications** - User feedback for all actions

##  Tech Stack

- **Frontend Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn UI
- **State Management**: Zustand
- **Drag & Drop**: @dnd-kit
- **Form Handling**: React Hook Form + Zod
- **Fake Data**: Faker.js
- **Icons**: Lucide React

##  Getting Started

### Prerequisites

- Node.js 20.19.0 or higher
- npm 10+ or yarn 1.22+

### Installation

1. **Clone the repository**
   ```
   git clone https://github.com/rajanarahul93/FormIQ.git
   cd FormIQ
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Start development server**
   ```
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```
npm run build
npm run preview 
```

##  Usage Guide

### Creating Your First Form

1. **Add Fields**: Drag field types from the sidebar to the canvas
2. **Configure Fields**: Click any field to edit properties in the right panel
3. **Set Validation**: Add required flags, length limits, and patterns
4. **Test Form**: Use the preview button to test your form
5. **Export**: Choose from JSON, HTML, or React component exports

### Using Templates

1. Navigate to the **Templates** tab in the sidebar
2. Browse the 5 professional templates:
   - Contact Form
   - User Registration
   - Event Registration
   - Customer Feedback
   - Job Application
3. Click **Use** to load any template instantly

### Smart Tools

- **Auto-fill**: Generate realistic test data for all fields
- **Export Options**: Multiple format exports with one click
- **Form Statistics**: Track field counts and requirements
- **Reset**: Clear form and start fresh


##  Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use conventional commit messages
- Add tests for new features
- Update documentation as needed
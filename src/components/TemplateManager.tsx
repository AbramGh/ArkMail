import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Plus, Edit, Trash2, Copy, Search, Filter,
  X, Save, Eye, Code, Type, Briefcase, Heart, Headphones
} from 'lucide-react';
import { EmailTemplate } from '../types/email';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';

interface TemplateManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate?: (template: EmailTemplate) => void;
}

export const TemplateManager: React.FC<TemplateManagerProps> = ({
  isOpen,
  onClose,
  onSelectTemplate
}) => {
  const { currentTheme } = useTheme();
  const isLiquidGlass = currentTheme.id === 'liquid-glass';
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | EmailTemplate['category']>('all');

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  const loadTemplates = () => {
    // Mock templates - in real app, load from service
    const mockTemplates: EmailTemplate[] = [
      {
        id: '1',
        name: 'Meeting Request',
        subject: 'Meeting Request - {{topic}}',
        body: 'Hi {{name}},\n\nI hope this email finds you well. I would like to schedule a meeting to discuss {{topic}}.\n\nWould you be available for a {{duration}} meeting sometime next week? Please let me know your preferred time slots.\n\nBest regards,\n{{sender_name}}',
        category: 'business',
        isDefault: false,
        createdAt: new Date('2025-01-10'),
        updatedAt: new Date('2025-01-10')
      },
      {
        id: '2',
        name: 'Thank You Note',
        subject: 'Thank you for {{reason}}',
        body: 'Dear {{name}},\n\nI wanted to take a moment to thank you for {{reason}}. Your {{specific_help}} was incredibly valuable and made a significant difference.\n\nI truly appreciate your time and effort.\n\nWarm regards,\n{{sender_name}}',
        category: 'personal',
        isDefault: false,
        createdAt: new Date('2025-01-08'),
        updatedAt: new Date('2025-01-08')
      },
      {
        id: '3',
        name: 'Project Update',
        subject: 'Project Update - {{project_name}}',
        body: 'Hi Team,\n\nHere\'s the latest update on {{project_name}}:\n\n**Completed:**\n- {{completed_items}}\n\n**In Progress:**\n- {{in_progress_items}}\n\n**Next Steps:**\n- {{next_steps}}\n\nPlease let me know if you have any questions or concerns.\n\nBest,\n{{sender_name}}',
        category: 'business',
        isDefault: true,
        createdAt: new Date('2025-01-05'),
        updatedAt: new Date('2025-01-12')
      },
      {
        id: '4',
        name: 'Customer Support Response',
        subject: 'Re: {{ticket_subject}}',
        body: 'Dear {{customer_name}},\n\nThank you for contacting our support team regarding {{issue_description}}.\n\nI understand your concern about {{specific_issue}}. Here\'s how we can resolve this:\n\n{{solution_steps}}\n\nIf you need any further assistance, please don\'t hesitate to reach out. We\'re here to help!\n\nBest regards,\n{{agent_name}}\nCustomer Support Team',
        category: 'support',
        isDefault: false,
        createdAt: new Date('2025-01-07'),
        updatedAt: new Date('2025-01-07')
      }
    ];
    setTemplates(mockTemplates);
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.body.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: EmailTemplate['category']) => {
    switch (category) {
      case 'business':
        return <Briefcase size={16} className="text-blue-400" />;
      case 'personal':
        return <Heart size={16} className="text-pink-400" />;
      case 'marketing':
        return <Type size={16} className="text-green-400" />;
      case 'support':
        return <Headphones size={16} className="text-purple-400" />;
      default:
        return <FileText size={16} className="text-cream/60" />;
    }
  };

  const handleCreateTemplate = () => {
    const newTemplate: EmailTemplate = {
      id: Date.now().toString(),
      name: 'New Template',
      subject: '',
      body: '',
      category: 'personal',
      isDefault: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setSelectedTemplate(newTemplate);
    setIsEditing(true);
  };

  const handleSaveTemplate = () => {
    if (selectedTemplate) {
      const updatedTemplate = {
        ...selectedTemplate,
        updatedAt: new Date()
      };
      
      const existingIndex = templates.findIndex(t => t.id === selectedTemplate.id);
      if (existingIndex >= 0) {
        const updatedTemplates = [...templates];
        updatedTemplates[existingIndex] = updatedTemplate;
        setTemplates(updatedTemplates);
      } else {
        setTemplates([...templates, updatedTemplate]);
      }
      
      setIsEditing(false);
    }
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId));
    if (selectedTemplate?.id === templateId) {
      setSelectedTemplate(null);
    }
  };

  const handleDuplicateTemplate = (template: EmailTemplate) => {
    const duplicatedTemplate: EmailTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      isDefault: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setTemplates([...templates, duplicatedTemplate]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className={cn(
              "rounded-2xl shadow-2xl w-full max-w-6xl h-[700px] flex",
              isLiquidGlass ? "liquid-glass-card" : "glass-card"
            )}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Templates List */}
            <div className="w-1/3 border-r border-cream/10 flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-cream/10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-light text-cream">Templates</h2>
                  <Button
                    onClick={handleCreateTemplate}
                    variant="primary"
                    icon={<Plus size={16} />}
                  >
                    New
                  </Button>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cream/60" size={16} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search templates..."
                    className={cn(
                      "w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none font-light",
                      isLiquidGlass ? "liquid-glass-input" : "glass-input"
                    )}
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as any)}
                  className={cn(
                    "w-full px-3 py-2 rounded-lg focus:outline-none font-light",
                    isLiquidGlass ? "liquid-glass-input" : "glass-input"
                  )}
                >
                  <option value="all">All Categories</option>
                  <option value="personal">Personal</option>
                  <option value="business">Business</option>
                  <option value="marketing">Marketing</option>
                  <option value="support">Support</option>
                </select>
              </div>

              {/* Templates List */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                  {filteredTemplates.map((template, index) => (
                    <motion.div
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      className={cn(
                        "p-3 rounded-lg cursor-pointer transition-all duration-300 group",
                        isLiquidGlass ? "liquid-glass-card" : "glass-card",
                        selectedTemplate?.id === template.id && "border-blue-400/30 bg-blue-500/10"
                      )}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(template.category)}
                          <h3 className="font-medium text-cream text-sm">{template.name}</h3>
                          {template.isDefault && (
                            <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicateTemplate(template);
                            }}
                            className="p-1 hover:bg-cream/20 rounded transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Copy size={12} className="text-cream/60" />
                          </motion.button>
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTemplate(template.id);
                            }}
                            className="p-1 hover:bg-cream/20 rounded transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 size={12} className="text-red-400" />
                          </motion.button>
                        </div>
                      </div>
                      
                      <p className="text-xs text-cream/60 font-light truncate">
                        {template.subject}
                      </p>
                      <p className="text-xs text-cream/50 font-light mt-1">
                        Updated {template.updatedAt.toLocaleDateString()}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Template Editor/Preview */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-cream/10">
                <h3 className="text-lg font-light text-cream">
                  {selectedTemplate ? (isEditing ? 'Edit Template' : 'Template Preview') : 'Select a Template'}
                </h3>
                <div className="flex items-center gap-2">
                  {selectedTemplate && (
                    <>
                      {!isEditing ? (
                        <>
                          <Button
                            onClick={() => setIsEditing(true)}
                            variant="ghost"
                            icon={<Edit size={16} />}
                          >
                            Edit
                          </Button>
                          {onSelectTemplate && (
                            <Button
                              onClick={() => {
                                onSelectTemplate(selectedTemplate);
                                onClose();
                              }}
                              variant="primary"
                            >
                              Use Template
                            </Button>
                          )}
                        </>
                      ) : (
                        <>
                          <Button
                            onClick={() => setIsEditing(false)}
                            variant="ghost"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleSaveTemplate}
                            variant="primary"
                            icon={<Save size={16} />}
                          >
                            Save
                          </Button>
                        </>
                      )}
                    </>
                  )}
                  <motion.button
                    onClick={onClose}
                    className="p-2 hover:bg-cream/10 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={18} className="text-cream/70" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                {selectedTemplate ? (
                  <div className="space-y-6">
                    {isEditing ? (
                      <>
                        {/* Edit Form */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-light text-cream/80 mb-2">Name</label>
                            <input
                              type="text"
                              value={selectedTemplate.name}
                              onChange={(e) => setSelectedTemplate({
                                ...selectedTemplate,
                                name: e.target.value
                              })}
                              className={cn(
                                "w-full px-4 py-3 rounded-xl focus:outline-none font-light",
                                isLiquidGlass ? "liquid-glass-input" : "glass-input"
                              )}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-light text-cream/80 mb-2">Category</label>
                            <select
                              value={selectedTemplate.category}
                              onChange={(e) => setSelectedTemplate({
                                ...selectedTemplate,
                                category: e.target.value as EmailTemplate['category']
                              })}
                              className={cn(
                                "w-full px-4 py-3 rounded-xl focus:outline-none font-light",
                                isLiquidGlass ? "liquid-glass-input" : "glass-input"
                              )}
                            >
                              <option value="personal">Personal</option>
                              <option value="business">Business</option>
                              <option value="marketing">Marketing</option>
                              <option value="support">Support</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-light text-cream/80 mb-2">Subject</label>
                          <input
                            type="text"
                            value={selectedTemplate.subject}
                            onChange={(e) => setSelectedTemplate({
                              ...selectedTemplate,
                              subject: e.target.value
                            })}
                            className={cn(
                              "w-full px-4 py-3 rounded-xl focus:outline-none font-light",
                              isLiquidGlass ? "liquid-glass-input" : "glass-input"
                            )}
                            placeholder="Email subject with {{variables}}"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-light text-cream/80 mb-2">Body</label>
                          <textarea
                            value={selectedTemplate.body}
                            onChange={(e) => setSelectedTemplate({
                              ...selectedTemplate,
                              body: e.target.value
                            })}
                            rows={12}
                            className={cn(
                              "w-full px-4 py-3 rounded-xl focus:outline-none font-light resize-none",
                              isLiquidGlass ? "liquid-glass-input" : "glass-input"
                            )}
                            placeholder="Email body with {{variables}} for dynamic content"
                          />
                        </div>

                        <div className="text-sm text-cream/60 font-light">
                          <p className="mb-2">Available variables:</p>
                          <div className="flex flex-wrap gap-2">
                            {['{{name}}', '{{sender_name}}', '{{date}}', '{{company}}', '{{topic}}'].map((variable) => (
                              <span key={variable} className="px-2 py-1 bg-cream/10 rounded text-xs">
                                {variable}
                              </span>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Preview */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-light text-cream/80 mb-2">Subject:</h4>
                            <p className="text-cream font-light">{selectedTemplate.subject}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-light text-cream/80 mb-2">Body:</h4>
                            <div className={cn(
                              "p-4 rounded-xl whitespace-pre-wrap font-light text-cream/90",
                              isLiquidGlass ? "liquid-glass-card" : "glass-card"
                            )}>
                              {selectedTemplate.body}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-cream/60 font-light">
                            <span>Category: {selectedTemplate.category}</span>
                            <span>Created: {selectedTemplate.createdAt.toLocaleDateString()}</span>
                            <span>Updated: {selectedTemplate.updatedAt.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-cream/60">
                    <div className="text-center">
                      <FileText size={48} className="mx-auto mb-4 opacity-40" />
                      <p className="font-light">Select a template to view or edit</p>
                      <p className="text-sm mt-2 opacity-60">Create reusable email templates for faster composition</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
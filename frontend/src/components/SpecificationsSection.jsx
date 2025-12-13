import { 
    Car, 
    Settings,
    FileText,
    Calendar,
    Gauge,
    Fuel,
    Key,
    PoundSterling,
    Shield,
    Wrench,
    Users,
    Award,
    CheckCircle,
    XCircle,
    Clock,
    Tag
} from "lucide-react";

// Icon mapping for specification fields - UPDATED
const specificationIcons = {
    // Vehicle Information
    registration: FileText,
    miles: Gauge,
    year: Calendar,
    bodyType: Car,
    transmission: Settings,
    fuelType: Fuel,
    colour: Car,
    
    // Extra Information
    keys: Key,
    motExpiry: Calendar,
    serviceHistory: Wrench,
    insuranceCategory: Shield,
    v5Status: FileText,
    previousOwners: Users,
    vatStatus: Tag,
    capClean: PoundSterling,
    vendor: Award,
};

// Field labels mapping - UPDATED
const fieldLabels = {
    // Vehicle Information
    registration: 'Registration Number',
    miles: 'Miles',
    year: 'Year',
    bodyType: 'Body Type',
    transmission: 'Transmission',
    fuelType: 'Fuel Type',
    colour: 'Colour',
    
    // Extra Information
    keys: 'Keys',
    motExpiry: 'MOT Expiry Date',
    serviceHistory: 'Service History',
    insuranceCategory: 'Insurance Category',
    v5Status: 'V5 Status',
    previousOwners: 'Previous Owners',
    vatStatus: 'VAT Status',
    capClean: 'CAP Clean (£)',
    vendor: 'Vendor',
};

// Value formatting functions
const formatValue = (field, value) => {
    if (!value) return '';
    
    // Handle date fields
    if (field === 'motExpiry') {
        try {
            const date = new Date(value);
            return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (e) {
            return value;
        }
    }
    
    // Handle number fields with units
    if (field === 'miles') return `${value.toLocaleString()} miles`;
    if (field === 'capClean') return `£${value.toLocaleString()}`;
    if (field === 'previousOwners') return `${value} owner${value !== 1 ? 's' : ''}`;
    if (field === 'keys') return `${value} key${value !== 1 ? 's' : ''}`;
    
    // Handle special field values
    if (field === 'serviceHistory') {
        if (value === 'Full Service') return <span className="text-green-600">✓ {value}</span>;
        if (value === 'Part Service') return <span className="text-yellow-600">⚠ {value}</span>;
        if (value === 'No History') return <span className="text-red-600">✗ {value}</span>;
    }
    
    if (field === 'v5Status') {
        if (value === 'V5 Present') return <span className="text-green-600">✓ {value}</span>;
        if (value === 'Applied For') return <span className="text-yellow-600">⏳ {value}</span>;
        if (value === 'Not Available') return <span className="text-red-600">✗ {value}</span>;
    }
    
    if (field === 'insuranceCategory') {
        if (value === 'No Cat') return <span className="text-green-600">✓ {value}</span>;
        return value;
    }
    
    if (field === 'vatStatus') {
        const statusColors = {
            'Marginal': 'text-purple-600',
            'Qualifying': 'text-blue-600',
            'Commercial': 'text-green-600'
        };
        const colorClass = statusColors[value] || 'text-gray-800';
        return <span className={colorClass}>{value}</span>;
    }
    
    return value;
};

// Field groupings matching the create/edit forms
const fieldGroups = {
    'Vehicle Information': [
        'registration', 'miles', 'year', 'bodyType', 'transmission', 'fuelType', 'colour'
    ],
    'Extra Information': [
        'keys', 'motExpiry', 'serviceHistory', 'insuranceCategory', 
        'v5Status', 'previousOwners', 'vatStatus', 'capClean', 'vendor'
    ]
};

// Specifications Section Component
const SpecificationsSection = ({ auction }) => {
    if (!auction.specifications || Object.keys(auction.specifications).length === 0) {
        return null;
    }

    // Helper to get value from Map or object
    const getFieldValue = (field) => {
        if (auction.specifications.get) {
            // If it's a Map
            return auction.specifications.get(field);
        } else {
            // If it's a regular object
            return auction.specifications[field];
        }
    };

    // Get all specifications as entries
    const getSpecificationsEntries = () => {
        if (auction.specifications.entries) {
            // If it's a Map
            return Array.from(auction.specifications.entries());
        } else {
            // If it's a regular object
            return Object.entries(auction.specifications);
        }
    };

    const entries = getSpecificationsEntries();

    return (
        <div className="mt-8">            
            {/* Render grouped sections */}
            {Object.entries(fieldGroups).map(([sectionName, sectionFields]) => {
                // Get fields that have values in this section
                const validFields = sectionFields.filter(field => {
                    const value = getFieldValue(field);
                    return value !== undefined && value !== null && value !== '' && value !== 0;
                });

                if (validFields.length === 0) return null;

                return (
                    <div key={sectionName} className="mb-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h4 className="text-sm font-medium text-secondary mb-4 flex items-center">
                            {sectionName === 'Vehicle Information' ? (
                                <Car size={20} className="mr-2" />
                            ) : (
                                <Settings size={20} className="mr-2" />
                            )}
                            {sectionName}
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                            {validFields.map(field => {
                                const value = getFieldValue(field);
                                if (!value || value === '' || value === 0) return null;
                                
                                const IconComponent = specificationIcons[field] || FileText;
                                const label = fieldLabels[field] || field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                                const formattedValue = formatValue(field, value);
                                
                                return (
                                    <div key={field} className="flex items-start gap-3 p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors shadow-sm">
                                        <IconComponent className="flex-shrink-0 w-5 h-5 mt-1 text-primary" strokeWidth={1.5} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-secondary text-sm font-medium">{label}</p>
                                            <div className="text-base font-medium text-gray-900 break-words">
                                                {formattedValue}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
            
            {/* Render any remaining fields not in our groups */}
            {(() => {
                const allGroupedFields = Object.values(fieldGroups).flat();
                const ungroupedEntries = entries.filter(([key]) => 
                    !allGroupedFields.includes(key) && 
                    getFieldValue(key) && 
                    getFieldValue(key) !== '' && 
                    getFieldValue(key) !== 0
                );

                if (ungroupedEntries.length === 0) return null;

                return (
                    <div className="mb-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h4 className="text-sm font-medium text-secondary mb-4 flex items-center">
                            <Settings size={20} className="mr-2" />
                            Additional Specifications
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                            {ungroupedEntries.map(([key, value]) => {
                                const IconComponent = specificationIcons[key] || FileText;
                                const label = fieldLabels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                                const formattedValue = formatValue(key, value);
                                
                                return (
                                    <div key={key} className="flex items-start gap-3 p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors shadow-sm">
                                        <IconComponent className="flex-shrink-0 w-5 h-5 mt-1 text-primary" strokeWidth={1.5} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-secondary text-sm font-medium">{label}</p>
                                            <p className="text-base font-medium text-gray-900 break-words">
                                                {formattedValue}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })()}
        </div>
    );
};

export default SpecificationsSection;
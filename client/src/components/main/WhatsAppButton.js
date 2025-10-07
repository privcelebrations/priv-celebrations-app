import React from 'react';

const WhatsAppButton = () => {
    const whatsappUrl = "https://api.whatsapp.com/send/?phone=918121012020&text=Hi%21+I%27m+interested+in+booking+a+private+theatre+experience.+Can+you+help+me%3F&type=phone_number&app_absent=0";

    return (
        <a 
            href={whatsappUrl} 
            className="whatsapp-icon" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="Chat on WhatsApp"
        >
            <svg viewBox="0 0 32 32">
                <path d=" M19.11 17.205c-.372 0-1.088 1.39-1.153 1.465-.065.075-.272.211-.565.211-.293 0-.565-.136-.928-.211-.363-.075-1.465-1.153-1.465-1.153s-1.153-1.465-1.218-1.53c-.065-.065-.136-.136-.136-.211 0-.075.272-.211.565-.486.293-.272.486-.565.65-.72.165-.155.211-.293.136-.486-.075-.192-.486-1.218-.65-1.608-.165-.39-.363-.486-.565-.486-.192 0-.363-.075-.486-.075-.123 0-.272.065-.41.211-.136.146-1.153 1.088-1.153 2.476 0 1.388 1.153 2.948 1.36 3.16.206.211 2.22 3.468 5.46 4.83.608.272 1.153.41 1.53.565.65.272 1.218.211 1.68.136.46-.075 1.465-.86 1.68-1.608.21-.748.21-1.388.136-1.465-.075-.075-.272-.136-.565-.211z M16.05 4.843a11.21 11.21 0 1 0 11.21 11.21 11.21 11.21 0 0 0-11.21-11.21zm0 20.552a9.34 9.34 0 1 1 9.34-9.34 9.35 9.35 0 0 1-9.34 9.34z" fillRule="evenodd"></path>
            </svg>
        </a>
    );
};

export default WhatsAppButton;

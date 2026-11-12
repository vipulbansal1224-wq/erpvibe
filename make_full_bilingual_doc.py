import os
import sys
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def create_document():
    doc = Document()

    # Page Margins
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    # Styles
    styles = doc.styles
    normal_style = styles['Normal']
    normal_style.font.name = 'Segoe UI'
    normal_style.font.size = Pt(10)
    normal_style.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)

    # Title Banner Table
    title_table = doc.add_table(rows=1, cols=1)
    title_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    title_table.autofit = False
    title_cell = title_table.rows[0].cells[0]
    title_cell.width = Inches(6.8)
    set_cell_background(title_cell, "1E293B") # Slate 800
    set_cell_margins(title_cell, top=300, bottom=300, left=250, right=250)

    p_title = title_cell.paragraphs[0]
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_sub = p_title.add_run("ENTERPRISE RESOURCE PLANNING • NEXT-GEN INDIA ERP SUITE\n")
    r_sub.font.size = Pt(9)
    r_sub.font.bold = True
    r_sub.font.color.rgb = RGBColor(0x38, 0xBD, 0xF8) # Sky blue

    r_main = p_title.add_run("ERPVibe Enterprise ERP\nComplete Architecture & Module Specification\n(पूर्ण वास्तुकला एवं मॉड्यूल विनिर्देश)")
    r_main.font.size = Pt(18)
    r_main.font.bold = True
    r_main.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    doc.add_paragraph() # Spacer

    # Introduction / Executive Summary (Bilingual)
    h1 = doc.add_heading(level=1)
    r_h1 = h1.add_run("1. Executive Overview / कार्यकारी सारांश")
    r_h1.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    p_intro_en = doc.add_paragraph()
    p_intro_en.add_run("English: ").bold = True
    p_intro_en.add_run(
        "ERPVibe is an all-inclusive, state-of-the-art enterprise ERP system engineered specifically for Indian businesses, "
        "manufacturing conglomerates, supply chain networks, retail chains, and IT/SaaS enterprises. "
        "It combines full statutory compliance (GSTIN APIs, e-Invoicing IRN, e-Way Bills, GSTR-1/3B, MCA Audit Trail, Schedule II & III) "
        "with deep operational depth comparable to global enterprise solutions like SAP S/4HANA, Odoo Enterprise, ERPNext, and Oracle NetSuite. "
        "With 22 deeply integrated modules, a built-in Feature Switchboard (enable/disable any module with one click), and production-grade "
        "Next.js 16 + TypeScript 5 architecture, ERPVibe is fully deployable to cloud infrastructure (Vercel, AWS, Azure, On-Premise)."
    )

    p_intro_hi = doc.add_paragraph()
    p_intro_hi.add_run("हिन्दी (Hindi): ").bold = True
    p_intro_hi.add_run(
        "ERPVibe भारतीय व्यवसायों, विनिर्माण उद्योगों, आपूर्ति श्रृंखला (Supply Chain), खुदरा दुकानों एवं आईटी/सास कंपनियों के लिए तैयार किया गया एक संपूर्ण और आधुनिक एंटरप्राइज ईआरपी सिस्टम है। "
        "यह पूर्ण वैधानिक अनुपालन (जीएसटीआईएन सत्यापन, ई-इनवॉइसिंग आईआरएन, ई-वे बिल, जीएसटीआर-1/3B, एमसीए ऑडिट ट्रेल, कंपनी अधिनियम शेड्यूल II एवं III) को वैश्विक ईआरपी समाधानों (SAP, Odoo, ERPNext, NetSuite) "
        "के समकक्ष उन्नत परिचालन गहराई के साथ जोड़ता है। इसमें कुल 22 एकीकृत मॉड्यूल, ऑन/ऑफ स्विचबोर्ड (किसी भी मॉड्यूल को एक क्लिक में सक्षम या अक्षम करने की सुविधा), तथा नेक्स्ट.जेएस 16 और टाइपस्क्रिप्ट 5 "
        "का प्रोडक्शन-ग्रेड आर्किटेक्चर शामिल है।"
    )

    doc.add_paragraph()

    # Modules Section
    h2 = doc.add_heading(level=1)
    r_h2 = h2.add_run("2. Comprehensive 22-Module Functional Catalogue (22 मॉड्यूल संपूर्ण विवरण)")
    r_h2.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    modules_data = [
        (
            "1. Executive Operations Dashboard\n(कार्यकारी संचालन डैशबोर्ड)",
            "Real-time visibility into daily sales, pending approvals, GST output tax liability vs eligible ITC credit, active work orders, low stock alerts, and quick actions.",
            "दैनिक बिक्री, लंबित अनुमोदन, जीएसटी देयता बनाम आईटीसी क्रेडिट, कार्य आदेश एवं कम स्टॉक का वास्तविक समय (Real-time) में व्यापक विश्लेषण एवं त्वरित शॉर्टकट।"
        ),
        (
            "2. India GST & Statutory Compliance Hub\n(भारत जीएसटी एवं अनुपालन हब)",
            "Direct IRP e-Invoice IRN generator with QR code, National NIC e-Way Bill generator with Part-B vehicle updates, GSTR-1 / GSTR-3B monthly auto-reconciliation, and 14,000+ Indian HSN/SAC code directory.",
            "क्यूआर कोड सहित आईआरपी ई-इनवॉइस आईआरएन जनरेशन, वाहन विवरण युक्त एनआईसी ई-वे बिल, जीएसटीआर-1 एवं जीएसटीआर-3B मासिक रिटर्न डेटा, तथा 14,000 से अधिक एचएसएन/एसएसी कोड डायरेक्टरी।"
        ),
        (
            "3. B2B & B2C Tax Invoicing & Billing\n(कर बीजक एवं बिलिंग प्रणाली)",
            "Full GST-compliant tax invoices, auto calculation of CGST, SGST, IGST based on State Code POS, reverse charge, LUT export billing, professional print layouts, and thermal receipt formats.",
            "राज्य कोड (Place of Supply) के आधार पर सीजीएसटी, एसजीएसटी, आईजीएसटी की स्वचालित गणना, रिवर्स चार्ज, एलयूटी निर्यात बिलिंग, तथा सरकारी प्रारूप में पीडीएफ/प्रिंट इनवॉइस।"
        ),
        (
            "4. Point of Sale (POS) Counter Terminal\n(काउंटर बिक्री पीओएस टर्मिनल)",
            "Cashier billing with touch item grid, barcode scanning, instant dynamic Bharat UPI QR code for paperless payments, cash drawer reconciliation, and quick thermal receipt generation.",
            "टच आइटम ग्रिड, बारकोड स्कैनर, तुरंत भुगतान हेतु भारत डायनामिक यूपीआई क्यूआर कोड, कैश रजिस्टर मिलान, तथा तेज थर्मल रसीद प्रिंटिंग।"
        ),
        (
            "5. Multi-Warehouse Stock & Item Master\n(बहु-गोदाम इन्वेंट्री एवं स्टॉक प्रबंधन)",
            "Real-time stock ledger, batch/serial tracking, warehouse bin transfers, reorder level alerts, HSN tax classifications, valuation methods (FIFO/Weighted Average), and stock adjustments.",
            "मल्टी-वेयरहाउस स्टॉक बहीखाता, बैच/सीरियल नंबर ट्रैकिंग, न्यूनतम स्टॉक चेतावनी, एचएसएन वर्गीकरण, तथा स्टॉक पुनर्मूल्यांकन।"
        ),
        (
            "6. Manufacturing & Production (BOM)\n(विनिर्माण एवं उत्पादन बीओएम)",
            "Multi-level Bill of Materials (BOM), planned work orders, raw material staging and automatic stock consumption, scrap recording, and production line capacity scheduling.",
            "मल्टी-लेवल बिल ऑफ मटेरियल्स (BOM), वर्क ऑर्डर निष्पादन, कच्चे माल की स्वचालित खपत, स्क्रैप रिकॉर्डिंग, तथा उत्पादन लाइन शेड्यूलिंग।"
        ),
        (
            "7. Quality Management & Inspection (QM)\n(गुणवत्ता प्रबंधन एवं निरीक्षण)",
            "Incoming raw material GRN inspection, in-process dimension & tolerance testing, pre-dispatch quality certificates, ISO 9001 compliance, and non-conformance quarantine management.",
            "कच्चे माल का जीआरएन निरीक्षण, इन-प्रोसेस सहनशीलता (Tolerance) जांच, प्री-डिस्पैच गुणवत्ता प्रमाणपत्र, आईएसओ 9001 अनुपालन, तथा अस्वीकृत सामग्री क्वारंटाइन।"
        ),
        (
            "8. Fleet & Vehicle Logistics Management (TMS)\n(वाहन बेड़ा एवं लॉजिस्टिक्स प्रबंधन)",
            "Commercial vehicle registry, driver assignments, fuel consumption logs, odometer tracking, e-Way bill vehicle mapping, and statutory validity tracking (Insurance, PUC, RTO Fitness).",
            "व्यावसायिक वाहन रजिस्टर, चालक आवंटन, ईंधन रिकॉर्ड, ओडोमीटर लॉग, ई-वे बिल लिंकेज, तथा बीमा, पीयूसी एवं फिटनेस प्रमाणपत्रों की समाप्ति चेतावनी।"
        ),
        (
            "9. Subcontracting & Job Work (GST Sec 143 / ITC-04)\n(सबकॉन्ट्रैक्टिंग एवं जॉब वर्क)",
            "Delivery challans under GST Section 143, raw materials sent to external job workers, received finished goods tracking, scrap yield accounting, and statutory 1-year input return compliance.",
            "जीएसटी धारा 143 के तहत डिलीवरी चालान, जॉब वर्कर को भेजी गई सामग्री, प्राप्त तैयार माल की ट्रैकिंग, स्क्रैप हिसाब, तथा 1 वर्ष के भीतर अनिवार्य सामग्री वापसी की निगरानी।"
        ),
        (
            "10. Subscriptions & Recurring AMC Invoicing\n(सदस्यता एवं वार्षिक रखरखाव अनुबंध - AMC)",
            "SaaS subscriptions, annual maintenance contracts, automated recurring invoicing engine, Monthly Recurring Revenue (MRR) tracking, renewal workflows, and auto GST invoicing.",
            "सास सब्सक्रिप्शन, वार्षिक रखरखाव अनुबंध (AMC), स्वचालित आवर्ती बिलिंग इंजन, मासिक आवर्ती राजस्व (MRR) रिपोर्टिंग, तथा ग्राहक नवीनीकरण सूचनाएं।"
        ),
        (
            "11. Projects & Timesheet Billing\n(परियोजनाएं एवं टाइमशीट बिलिंग)",
            "Client project milestone tracking, task kanban boards, team member billable timesheet logging, cost-to-complete metrics, and automated invoice conversion from approved hours.",
            "क्लाइंट प्रोजेक्ट माइलस्टोन ट्रैकिंग, टास्क कानबन बोर्ड, प्रति घंटा बिलिंग टाइमशीट, प्रोजेक्ट लागत विश्लेषण, तथा स्वीकृत घंटों से सीधे बिल तैयार करना।"
        ),
        (
            "12. Banking & Bank Reconciliation\n(बैंकिंग एवं स्वचालित समाधान)",
            "Multi-bank accounts (Current, Escrow, Cash Credit), automated bank statement import, 1-click transaction matching against open sales and purchase invoices, and uncleared cheques ledger.",
            "मल्टी-बैंक खाते, बैंक स्टेटमेंट ऑटो-इम्पोर्ट, खुली इनवॉइस से 1-क्लिक स्वचालित मिलान (Reconciliation), तथा बकाया चेक ट्रैकिंग।"
        ),
        (
            "13. Employee Expenses & Claims\n(कर्मचारी व्यय दावे एवं प्रतिपूर्ति)",
            "Staff reimbursement claims for travel, fuel, client entertainment, and lodging, GST tax invoice attachment validation, multi-tier manager approvals, and payroll disbursement.",
            "कर्मचारियों के यात्रा, ईंधन, भोजन एवं होटल व्यय दावे, जीएसटी बिल सत्यापन, बहुस्तरीय अनुमोदन, तथा वेतन के साथ स्वचालित भुगतान।"
        ),
        (
            "14. Fixed Assets & Depreciation (Schedule II)\n(अचल संपत्ति एवं मूल्यह्रास अनुसूची II)",
            "Asset register (Plant, Machinery, IT, Furniture), automated Straight Line Method (SLM) & Written Down Value (WDV) depreciation under Companies Act 2013 Schedule II, and net block audit.",
            "कंपनी अधिनियम 2013 अनुसूची II के तहत संयंत्र, मशीनरी, आईटी उपकरणों का रजिस्टर, एसएलएम और डब्ल्यूडीवी पद्धतियों द्वारा स्वचालित मूल्यह्रास गणना।"
        ),
        (
            "15. Customer Relationship Management (CRM)\n(ग्राहक संबंध प्रबंधन एवं उद्धरण)",
            "Verified customer directory with GSTIN, PAN, credit limit enforcement, state-specific billing addresses, customer ledger statements, and quotation to invoice conversion.",
            "जीएसटीआईएन एवं पैन सत्यापित ग्राहक डायरेक्टरी, क्रेडिट सीमा नियंत्रण, ग्राहक खाता विवरण (Ledger), तथा वाणिज्यिक प्रस्ताव (कोटेशन)।"
        ),
        (
            "16. Suppliers & MSME Procurement\n(आपूर्तिकर्ता एवं एमएसएमई खरीद)",
            "Vendor master categorized into MSME Micro, Small, and Medium enterprises to enforce statutory 45-day payment rules, purchase orders, goods receipt notes (GRN), and vendor bills.",
            "एमएसएमई (सूक्ष्म, लघु, मध्यम) वर्गीकृत विक्रेता रजिस्टर, 45-दिवसीय अनिवार्य भुगतान अनुपालन, खरीद आदेश (PO), और देयताएं।"
        ),
        (
            "17. Recruitment & Applicant Tracking (ATS)\n(भर्ती एवं आवेदक ट्रैकिंग प्रणाली)",
            "Job postings, candidate pipeline stages (Applied, Screening, Tech Interview, HR Round, Hired), star ratings, candidate dossier management, and 1-click employee onboarding.",
            "नौकरी रिक्तियां, उम्मीदवार पाइपलाइन (आवेदन, स्क्रीनिंग, तकनीकी साक्षात्कार, एचआर राउंड, चयन), रेटिंग, तथा चयनित उम्मीदवार का सीधे पेरोल में स्थानांतरण।"
        ),
        (
            "18. Statutory Payroll & Payslips\n(वैधानिक वेतन एवं पे-स्लिप)",
            "Monthly salary processing with Indian statutory deductions: Employees' Provident Fund (EPF 12%), Employee State Insurance (ESIC 0.75%/3.25%), Professional Tax (PT), and Salary TDS.",
            "भारतीय वैधानिक कटौती सहित मासिक वेतन: कर्मचारी भविष्य निधि (EPF 12%), राज्य बीमा (ESIC), व्यावसायिक कर (PT), टीडीएस, एवं आधिकारिक पे-स्लिप।"
        ),
        (
            "19. Legal Document Management Vault (DMS)\n(कानूनी दस्तावेज एवं अनुपालन वॉल्ट)",
            "Encrypted repository for corporate charter (MOA/AOA, CIN), GST REG-06, MSME Udyam, factory licenses, leases, pollution certificates, and automatic expiry reminder alarms.",
            "कंपनी पंजीकरण (CIN), जीएसटी प्रमाण पत्र, एमएसएमई उद्यम, वाणिज्यिक पट्टे, प्रदूषण नियंत्रण सहमति आदि के लिए एन्क्रिप्टेड सुरक्षित वॉल्ट एवं नवीनीकरण अलर्ट।"
        ),
        (
            "20. Financial Statements & Analytics (Schedule III)\n(वित्तीय विवरण एवं पीएंडएल रिपोर्ट)",
            "Companies Act Schedule III Balance Sheet, Profit & Loss Statement, Cash Flow Statement, Trial Balance, Gross Margin analysis, and one-click CSV/PDF export.",
            "कंपनी अधिनियम अनुसूची III के तहत बैलेंस शीट, लाभ-हानि खाता (P&L), नकद प्रवाह (Cash Flow), ट्रायल बैलेंस, तथा ऑडिट रेडी वित्तीय विवरण।"
        ),
        (
            "21. Chart of Accounts (General Ledger)\n(खाता चार्ट एवं मुख्य बहीखाता)",
            "Hierarchical standard Chart of Accounts covering Assets, Liabilities, Equity, Revenue, and Expenses, with debit/credit balance validations and real-time trial balances.",
            "संपत्ति, देनदारियां, इक्विटी, राजस्व एवं व्यय को कवर करने वाला पदानुक्रमित चार्ट ऑफ अकाउंट्स, स्वचालित डेबिट/क्रेडिट संतुलन।"
        ),
        (
            "22. MCA Mandatory Audit Trail (Edit Log)\n(एमसीए अनिवार्य ऑडिट ट्रेल एवं एडिट लॉग)",
            "Indian Ministry of Corporate Affairs (MCA) mandated immutable audit log tracking every database insert, update, deletion, timestamp, user role, and client IP address.",
            "कंपनी मामलों के मंत्रालय (MCA) के नियमों के अनुसार अपरिवर्तनीय ऑडिट ट्रेल, जो प्रत्येक लेन-देन के परिवर्तन, समय, उपयोगकर्ता और आईपी पते को रिकॉर्ड करता है।"
        ),
    ]

    for title, desc_en, desc_hi in modules_data:
        m_table = doc.add_table(rows=3, cols=1)
        m_table.alignment = WD_TABLE_ALIGNMENT.CENTER
        m_table.autofit = False
        
        # Header Row
        hdr_cell = m_table.rows[0].cells[0]
        hdr_cell.width = Inches(6.8)
        set_cell_background(hdr_cell, "F1F5F9")
        set_cell_margins(hdr_cell, top=140, bottom=140, left=180, right=180)
        p_hdr = hdr_cell.paragraphs[0]
        r_t = p_hdr.add_run(title)
        r_t.font.bold = True
        r_t.font.size = Pt(11)
        r_t.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

        # English Desc Row
        en_cell = m_table.rows[1].cells[0]
        en_cell.width = Inches(6.8)
        set_cell_margins(en_cell, top=100, bottom=80, left=180, right=180)
        p_en = en_cell.paragraphs[0]
        p_en.add_run("English: ").bold = True
        p_en.add_run(desc_en)

        # Hindi Desc Row
        hi_cell = m_table.rows[2].cells[0]
        hi_cell.width = Inches(6.8)
        set_cell_margins(hi_cell, top=80, bottom=120, left=180, right=180)
        p_hi = hi_cell.paragraphs[0]
        p_hi.add_run("हिन्दी (Hindi): ").bold = True
        p_hi.add_run(desc_hi)

        doc.add_paragraph() # Small spacer

    # Section 3: Feature Switchboard & Customization
    h3 = doc.add_heading(level=1)
    r_h3 = h3.add_run("3. Modular Switchboard & Deployment (मॉड्यूलर ऑन/ऑफ स्विचबोर्ड एवं डिप्लॉयमेंट)")
    r_h3.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    p_sw_en = doc.add_paragraph()
    p_sw_en.add_run("Modular Toggle Switchboard: ").bold = True
    p_sw_en.add_run(
        "ERPVibe features a granular Module Configuration Switchboard in the Settings view. "
        "Any business can toggle off modules that are not relevant to their current business scale. "
        "For example, a pure trading firm can disable Manufacturing, Job Work, and Projects with a single click, "
        "instantly decluttering the sidebar and global search without code changes or restarts."
    )

    p_sw_hi = doc.add_paragraph()
    p_sw_hi.add_run("मॉड्यूलर स्विचबोर्ड (सक्षम/अक्षम सुविधा): ").bold = True
    p_sw_hi.add_run(
        "ERPVibe में सेटिंग्स के अंदर एक विशेष 'मॉड्यूल स्विचबोर्ड' दिया गया है। "
        "यदि कोई व्यापारी या कंपनी विनिर्माण (Manufacturing) या जॉब वर्क (Job Work) नहीं करती, तो वह सिर्फ एक क्लिक से उन मॉड्यूल्स को अक्षम (Disable) कर सकती है। "
        "इससे साइडबार और सर्च मेनू तुरंत साफ हो जाते हैं और सॉफ्टवेयर केवल उनके काम के विकल्प ही दिखाता है।"
    )

    p_data_en = doc.add_paragraph()
    p_data_en.add_run("Data Reset & Showcase Demo Switch: ").bold = True
    p_data_en.add_run(
        "Users can instantly switch between 'Clean Slate Mode' (for production deployment with zero dummy figures) "
        "and 'Restore Demo Data' (for client demonstrations, training, and investor showcases)."
    )

    p_data_hi = doc.add_paragraph()
    p_data_hi.add_run("डेटा रीसेट एवं डेमो मोड: ").bold = True
    p_data_hi.add_run(
        "उपयोगकर्ता 'क्लीन स्लेट' बटन दबाकर सभी डमी और परीक्षण डेटा को हटाकर शून्य से वास्तविक बिलिंग शुरू कर सकते हैं, "
        "अथवा 'डेमो डेटा रिस्टोर' दबाकर प्रस्तुतियों और प्रशिक्षण के लिए तैयार सैंपल रिकॉर्ड पुनः लोड कर सकते हैं।"
    )

    # Save to both paths
    dest1 = r"C:\Users\adfmin\Downloads\ERPVibe_Complete_Documentation_Bilingual.docx"
    dest2 = r"C:\Users\adfmin\Downloads\erpvibe\ERPVibe_Documentation.docx"
    dest3 = r"C:\Users\adfmin\Downloads\erpvibe\ERPVibe_Complete_Documentation_Bilingual.docx"

    doc.save(dest1)
    doc.save(dest2)
    doc.save(dest3)
    print(f"Saved successfully to {dest1} and {dest2}")

if __name__ == "__main__":
    create_document()

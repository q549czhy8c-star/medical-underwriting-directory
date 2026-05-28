window.MUW_DATA = {
  appVersion: "0.1.3",
  schemaVersion: "2026-05-28.1",
  publicSources: [
    {
      id: "cdc-heart-risk",
      name: "CDC Heart Disease Risk Factors",
      url: "https://www.cdc.gov/heart-disease/risk-factors/index.html",
      note: {
        en: "Public risk-factor reference for cardiovascular mortality and morbidity context.",
        zh: "公開心血管死亡率與發病率風險因子參考。"
      }
    },
    {
      id: "nice-hypertension",
      name: "NICE Hypertension NG136",
      url: "https://www.nice.org.uk/guidance/ng136/chapter/recommendations",
      note: {
        en: "Clinical reference for BP staging, cardiovascular risk discussion, and follow-up.",
        zh: "血壓分期、心血管風險討論及跟進的臨床參考。"
      }
    },
    {
      id: "who-diabetes",
      name: "WHO Diabetes Fact Sheet",
      url: "https://www.who.int/news-room/fact-sheets/detail/diabetes",
      note: {
        en: "Public complications reference for diabetes, including vascular and renal outcomes.",
        zh: "糖尿病併發症公開資料，涵蓋血管及腎臟結果。"
      }
    },
    {
      id: "cdc-asthma",
      name: "CDC Asthma",
      url: "https://www.cdc.gov/asthma/index.html",
      note: {
        en: "Public respiratory disease reference for asthma control and exacerbation context.",
        zh: "哮喘控制及急性發作背景的公開呼吸系統疾病參考。"
      }
    },
    {
      id: "acs-recurrence",
      name: "American Cancer Society Recurrence",
      url: "https://www.cancer.org/cancer/survivorship/long-term-health-concerns/recurrence.html",
      note: {
        en: "Cancer recurrence and survivorship context for CI underwriting review.",
        zh: "癌症復發及康復期背景，可支援 CI 核保評估。"
      }
    }
  ],
  diagnoses: [
    {
      id: "dx-hypertension",
      category_body_part: "cardiovascular",
      age_group: ["young_adult", "middle_age", "older_adult"],
      gender: "unisex",
      severity: "mild_to_severe",
      diagnosis_name: { en: "Hypertension", zh: "高血壓" },
      source_type: "public_seed",
      source_ids: ["cdc-heart-risk", "nice-hypertension"],
      base_data: {
        causes: {
          en: "Primary hypertension is commonly associated with age, family history, weight, diet, alcohol intake, renal disease, endocrine causes, and medication effects.",
          zh: "原發性高血壓常與年齡、家族史、體重、飲食、酒精、腎病、內分泌原因及藥物影響有關。"
        },
        risks: {
          en: "Main underwriting concerns are elevated cardiovascular mortality and morbidity, including myocardial infarction, stroke, heart failure, renal impairment, and end-organ damage.",
          zh: "主要核保風險為心血管死亡率及發病率上升，包括心肌梗塞、中風、心衰竭、腎功能受損及靶器官損害。"
        },
        treatments: {
          en: "Lifestyle modification, home or ambulatory BP monitoring, antihypertensive therapy, lipid and diabetes risk management, and ongoing follow-up.",
          zh: "生活方式調整、家居或動態血壓監測、降血壓藥物、血脂及糖尿病風險管理，以及定期跟進。"
        }
      },
      underwriting_rules: {
        requirements: "Recent BP readings, medication list, compliance history, renal function, urine protein, ECG if indicated, and evidence of end-organ damage assessment.",
        decisions_reference: "Life: standard to rated depending on control and complications. CI: standard only if controlled and no vascular/renal complications; postpone or rate for severe uncontrolled cases.",
        ai_suggestions: ""
      },
      offers: [
        { stage: "Controlled, no complications", life: "Standard to +50%", ci: "Standard to +75%", notes: "Review duration of control and treatment adherence." },
        { stage: "Stage 2 / multiple risk factors", life: "+75% to +150%", ci: "+100% or exclusion", notes: "Consider age, smoking, diabetes, lipids, and BMI." },
        { stage: "End-organ damage", life: "Individual consideration", ci: "Postpone / decline", notes: "Renal, cardiac, cerebrovascular evidence drives outcome." }
      ],
      updated_by: "PublicSeed",
      last_updated: "2026-05-28T00:00:00.000Z"
    },
    {
      id: "dx-type-2-diabetes",
      category_body_part: "endocrine",
      age_group: ["young_adult", "middle_age", "older_adult"],
      gender: "unisex",
      severity: "controlled_to_complicated",
      diagnosis_name: { en: "Type 2 Diabetes Mellitus", zh: "二型糖尿病" },
      source_type: "public_seed",
      source_ids: ["who-diabetes"],
      base_data: {
        causes: {
          en: "Insulin resistance and progressive beta-cell dysfunction, associated with obesity, age, family history, inactivity, and metabolic syndrome.",
          zh: "胰島素阻抗及胰島 beta 細胞功能逐步下降，與肥胖、年齡、家族史、缺乏運動及代謝症候群相關。"
        },
        risks: {
          en: "Underwriting concerns include excess cardiovascular, renal, retinal, neuropathic, and peripheral vascular morbidity, plus mortality from macrovascular disease.",
          zh: "核保關注包括心血管、腎臟、視網膜、神經及周邊血管發病率上升，以及大血管疾病相關死亡率。"
        },
        treatments: {
          en: "Diet, exercise, weight management, oral antihyperglycemics or injectables, cardiovascular risk control, complication screening, and HbA1c monitoring.",
          zh: "飲食、運動、體重管理、口服或注射降糖藥、心血管風險控制、併發症篩查及 HbA1c 監測。"
        }
      },
      underwriting_rules: {
        requirements: "Age at diagnosis, duration, HbA1c trend, medications, BMI, blood pressure, lipids, renal profile, urine ACR, eye screening, neuropathy and vascular history.",
        decisions_reference: "Life: often rated by age, duration, control, and complications. CI: cautious; complications or poor control may require postponement, exclusion, or decline.",
        ai_suggestions: ""
      },
      offers: [
        { stage: "Good control, no complications", life: "+50% to +100%", ci: "+75% to +150%", notes: "Better view if older onset and stable HbA1c." },
        { stage: "Poor control or long duration", life: "+150% to +250%", ci: "Postpone / exclusion", notes: "Require trend improvement before final offer." },
        { stage: "Renal / vascular complications", life: "Individual consideration", ci: "Decline likely", notes: "Manual-specific reinsurer evidence required." }
      ],
      updated_by: "PublicSeed",
      last_updated: "2026-05-28T00:00:00.000Z"
    },
    {
      id: "dx-asthma",
      category_body_part: "respiratory",
      age_group: ["child", "young_adult", "middle_age", "older_adult"],
      gender: "unisex",
      severity: "intermittent_to_severe",
      diagnosis_name: { en: "Asthma", zh: "哮喘" },
      source_type: "public_seed",
      source_ids: ["cdc-asthma"],
      base_data: {
        causes: {
          en: "Chronic airway inflammation with variable triggers, including allergens, respiratory infections, smoke, occupational exposure, exercise, and environmental pollutants.",
          zh: "慢性氣道炎症，誘因可包括過敏原、呼吸道感染、煙霧、職業暴露、運動及環境污染物。"
        },
        risks: {
          en: "Insurance concerns include acute exacerbations, hospitalization, steroid dependence, impaired lung function, and overlap with COPD or smoking-related disease.",
          zh: "保險風險包括急性發作、住院、依賴類固醇、肺功能受損，以及與 COPD 或吸煙相關疾病重疊。"
        },
        treatments: {
          en: "Trigger avoidance, inhaled controller therapy, reliever therapy, biologics for selected severe cases, action plans, and pulmonary function monitoring.",
          zh: "避免誘因、吸入式控制藥物、舒緩藥物、嚴重個案使用生物製劑、行動計劃及肺功能監測。"
        }
      },
      underwriting_rules: {
        requirements: "Frequency of attacks, ER visits or admissions, oral steroid courses, smoking status, spirometry, current inhaler regimen, biologic use, and occupational triggers.",
        decisions_reference: "Life: standard to small rating for mild controlled asthma; higher rating/postpone for recent severe attacks. CI: standard possible if mild and stable; severe cases may be rated or postponed.",
        ai_suggestions: ""
      },
      offers: [
        { stage: "Mild, no admission", life: "Standard", ci: "Standard", notes: "Confirm stable control and no smoking." },
        { stage: "Moderate, recurrent steroids", life: "+50% to +100%", ci: "+50% or postpone", notes: "Review recent exacerbation pattern." },
        { stage: "Severe / ICU history", life: "Postpone / rated", ci: "Postpone / decline", notes: "Needs specialist report and lung function." }
      ],
      updated_by: "PublicSeed",
      last_updated: "2026-05-28T00:00:00.000Z"
    },
    {
      id: "dx-breast-cancer",
      category_body_part: "oncology",
      age_group: ["young_adult", "middle_age", "older_adult"],
      gender: "female",
      severity: "stage_based",
      diagnosis_name: { en: "Breast Cancer History", zh: "乳癌病史" },
      source_type: "public_seed",
      source_ids: ["acs-recurrence"],
      base_data: {
        causes: {
          en: "Multifactorial malignancy risk associated with age, genetics, hormonal exposure, breast density, lifestyle, and prior breast disease.",
          zh: "多因素惡性腫瘤風險，與年齡、遺傳、荷爾蒙暴露、乳房密度、生活方式及既往乳房疾病相關。"
        },
        risks: {
          en: "Primary concerns are recurrence, metastasis, second malignancy, treatment complications, and impact on CI claim probability after diagnosis.",
          zh: "主要關注為復發、轉移、第二原發癌、治療併發症，以及診斷後對 CI 索償概率的影響。"
        },
        treatments: {
          en: "Surgery, radiotherapy, chemotherapy, endocrine therapy, targeted therapy, immunotherapy, surveillance imaging, and survivorship care planning.",
          zh: "手術、放射治療、化療、內分泌治療、標靶治療、免疫治療、監察影像及康復期護理計劃。"
        }
      },
      underwriting_rules: {
        requirements: "Pathology, TNM stage, receptor status, nodal status, grade, treatment dates, current remission status, follow-up imaging, oncology report, and recurrence history.",
        decisions_reference: "Life: postpone after recent treatment, then extra mortality or lien by stage/time since completion. CI: generally postpone/decline for recent or invasive cancer history unless manual allows limited terms.",
        ai_suggestions: ""
      },
      offers: [
        { stage: "In situ, completed treatment", life: "Postpone then possible standard/rated", ci: "Postpone / exclusion", notes: "Needs manual wording by reinsurer." },
        { stage: "Early invasive, disease-free interval", life: "Lien or rating", ci: "Usually decline/postpone", notes: "Stage and years since treatment are decisive." },
        { stage: "Advanced / recurrence", life: "Decline likely", ci: "Decline likely", notes: "Requires specialist evidence and reinsurer consultation." }
      ],
      updated_by: "PublicSeed",
      last_updated: "2026-05-28T00:00:00.000Z"
    }
  ]
};

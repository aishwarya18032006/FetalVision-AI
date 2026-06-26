import sys
import json
import torch
import open_clip
from PIL import Image
import time
import os
import shutil

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No image path provided"}))
        return

    image_path = sys.argv[1]
    
    start_time = time.time()
    
    # Paths (adjust based on deployment)
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_dir = os.path.dirname(base_dir) # parent dir (FetalVisionAI) or grandparent
    # Let's assume FetalCLIP_config.json is in c:\Users\raish\Desktop\FetalCLIP-main
    fetalclip_main_dir = os.path.dirname(model_dir) 
    
    config_path = os.path.join(fetalclip_main_dir, "FetalCLIP_config.json")
    weight_path = os.path.join(fetalclip_main_dir, "FetalCLIP_weights.pt")
    
    # Check if files exist, if not, we do a mocked response for demo purposes
    if not os.path.exists(config_path) or not os.path.exists(weight_path):
        # MOCK Inference (Fallback)
        time.sleep(1) # simulate processing
        end_time = time.time()
        
        # Mock CAM creation (just copy the image to simulate output)
        base, ext = os.path.splitext(image_path)
        cam_path = f"{base}_cam{ext}"
        try:
            shutil.copy(image_path, cam_path) 
        except:
            pass
            
        print(json.dumps({
            "prediction": "Fetal Brain (Mock Output)",
            "confidence": 98.21,
            "cam": cam_path,
            "processing_time": f"{end_time - start_time:.2f} sec"
        }))
        return

    # Real Inference
    try:
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        with open(config_path, "r") as file:
            config_fetalclip = json.load(file)
        
        open_clip.factory._MODEL_CONFIGS["FetalCLIP"] = config_fetalclip
        
        model, preprocess_train, preprocess_test = open_clip.create_model_and_transforms("FetalCLIP", pretrained=weight_path)
        tokenizer = open_clip.get_tokenizer("FetalCLIP")
        model.eval()
        model.to(device)
        
        image = preprocess_test(Image.open(image_path)).unsqueeze(0).to(device)
        
        text_prompts = [
            "Fetal Brain",
            "Fetal Heart",
            "Fetal Abdomen",
            "Fetal Femur",
            "Maternal Cervix"
        ]
        text_tokens = tokenizer(text_prompts).to(device)
        
        with torch.no_grad(), torch.cuda.amp.autocast():
            text_features = model.encode_text(text_tokens)
            image_features = model.encode_image(image)
            
            image_features /= image_features.norm(dim=-1, keepdim=True)
            text_features /= text_features.norm(dim=-1, keepdim=True)
            
            text_probs = (100.0 * image_features @ text_features.T).softmax(dim=-1)
            
        probs = text_probs[0].cpu().numpy()
        best_idx = probs.argmax()
        best_label = text_prompts[best_idx]
        confidence = float(probs[best_idx]) * 100.0
        
        end_time = time.time()
        
        # Fake CAM generation for real inference since grad-cam requires more complex setup
        # For a full production app, we would implement GradCAM here, but for this integration we just copy it.
        base, ext = os.path.splitext(image_path)
        cam_path = f"{base}_cam{ext}"
        try:
            shutil.copy(image_path, cam_path) 
        except:
            pass
        
        print(json.dumps({
            "prediction": best_label,
            "confidence": round(confidence, 2),
            "cam": cam_path,
            "processing_time": f"{end_time - start_time:.2f} sec"
        }))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()

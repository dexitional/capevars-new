#!/usr/bin/env python3

import zipfile
import json
import hashlib
from pathlib import Path, PurePosixPath

# Test with Ghanaian Language Ga Basic 1 ZIP - mimicking the actual extractor
zip_path = "/Users/dexitional/Documents/projects/FullStack/coreos/frontend/capevars/files/new/Ghanaian_Language_Ga_Basic_1_Complete_Multimedia_Package.zip"

# Mimic what extract-kidi-packages.py does
archive = Path(zip_path)
digest = hashlib.sha256(archive.read_bytes()).hexdigest()
print(f"Digest: {digest}")

with zipfile.ZipFile(archive) as z:
    datasets = [n for n in z.namelist() if n.endswith(('teacher_lesson_data.json', 'lesson_data_with_answers.json', 'course.json'))]
    print(f"Datasets found: {datasets}")
    
    for dataset in datasets:
        print(f"\nProcessing dataset: {dataset}")
        prefix = dataset.rsplit('/', 1)[0] + '/'
        print(f"Prefix: {prefix}")
        
        names = {n[len(prefix):]: n for n in z.namelist() if n.startswith(prefix)}
        print(f"Number of files in names: {len(names)}")
        
        # Show some names to verify
        name_list = sorted(list(names.keys()))
        print(f"All names: {name_list}")
        
        # Load the data
        data = json.loads(z.read(dataset))
        lessons = data['lessons'] if isinstance(data, dict) else data
        print(f"Number of lessons: {len(lessons)}")
        
        # Process each lesson
        for i, lesson in enumerate(lessons):
            print(f"\n--- Processing lesson {i} (lesson number {i+1}) ---")
            print(f"Lesson title: {lesson.get('title')}")
            
            # This is what the actual normalized function does
            index = i + 1  # lesson number (1-based)
            print(f"Index (lesson number): {index}")
            
            video_candidates = [
                f'videos/lesson_{index:02}.mp4',
                f'videos/lesson_{index}.mp4',
                f'videos/Lesson_{index:02}.mp4',
                f'videos/OFFLINE_LESSON_{index:02}.MP4'
            ]
            image_candidates = [
                f'illustrations/lesson_{index:02}.png',
                f'illustrations/lesson_{index}.png',
                f'illustrations/Lesson_{index:02}.PNG',
                f'illustrations/OFFLINE_LESSON_{index:02}.PNG'
            ]
            
            print(f"Video candidates: {video_candidates}")
            print(f"Image candidates: {image_candidates}")
            
            video = next((n for n in video_candidates if n in names), None)
            image = next((n for n in image_candidates if n in names), None)
            
            print(f"Found video: {video}")
            print(f"Found image: {image}")
            
            if video is None:
                print("VIDEO NOT FOUND!")
                # Let's see what video files we actually have in names
                video_files = [n for n in names.keys() if n.startswith('videos/') and n.endswith('.mp4')]
                print(f"Available video files: {video_files}")
            if image is None:
                print("IMAGE NOT FOUND!")
                # Let's see what image files we actually have in names
                image_files = [n for n in names.keys() if n.startswith('illustrations/') and n.endswith('.png')]
                print(f"Available image files: {image_files}")
                
            if video is not None and image is not None:
                print("SUCCESS: Both video and image found!")
            else:
                print("FAILURE: Missing video or image")
                break  # Stop on first failure
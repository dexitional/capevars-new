#!/usr/bin/env python3

import zipfile
import json

# Test with Ghanaian Language Ga Basic 1 ZIP
zip_path = "/Users/dexitional/Documents/projects/FullStack/coreos/frontend/capevars/files/new/Ghanaian_Language_Ga_Basic_1_Complete_Multimedia_Package.zip"

with zipfile.ZipFile(zip_path) as z:
    # Find the dataset file
    datasets = [n for n in z.namelist() if n.endswith(('teacher_lesson_data.json', 'lesson_data_with_answers.json', 'course.json'))]
    print("Datasets found:", datasets)
    
    for dataset in datasets:
        print(f"\nProcessing dataset: {dataset}")
        prefix = dataset.rsplit('/', 1)[0] + '/'
        print(f"Prefix: {prefix}")
        
        names = {n[len(prefix):]: n for n in z.namelist() if n.startswith(prefix)}
        print(f"Number of files in names: {len(names)}")
        
        # Show first 10 names
        name_list = list(names.keys())[:10]
        print(f"First 10 names: {name_list}")
        
        # Load the data
        data = json.loads(z.read(dataset))
        lessons = data['lessons'] if isinstance(data, dict) else data
        print(f"Number of lessons: {len(lessons)}")
        
        # Check first lesson
        if lessons:
            lesson = lessons[0]
            print(f"\nFirst lesson keys: {list(lesson.keys())}")
            print(f"First lesson title: {lesson.get('title')}")
            
            # Check what video/image files we expect for lesson 1 (index 0 in lessons, but lesson number 1)
            index = 1  # lesson number
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
            
            print(f"\nFor lesson {index}:")
            print(f"Video candidates: {video_candidates}")
            print(f"Image candidates: {image_candidates}")
            
            video = next((n for n in video_candidates if n in names), None)
            image = next((n for n in image_candidates if n in names), None)
            
            print(f"Found video: {video}")
            print(f"Found image: {image}")
            
            if video:
                print(f"Video full path: {names[video]}")
            if image:
                print(f"Image full path: {names[image]}")
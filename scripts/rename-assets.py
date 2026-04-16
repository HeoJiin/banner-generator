#!/usr/bin/env python3
"""
에셋 파일명 한글→영어 일괄 변환 스크립트
- public/assets/3d/*.png
- public/assets/backgrounds/*.png
- 소스 코드 내 참조도 일괄 치환
"""

import os
import re
import json
import glob

# ── 한글 → 영어 매핑 ──
KO_TO_EN = {
    # 소구점 키워드
    '혜택': 'benefit',
    '성장': 'growth',
    '긴급': 'urgent',
    '정보 제공': 'info',
    '100원': '100won',
    # 시즌
    '봄': 'spring', '여름': 'summer', '가을': 'autumn', '겨울': 'winter',
    '크리스마스': 'christmas', '신년': 'newyear', '추석': 'chuseok',
    # 돈/금융
    '만원': '10000won', '오천원': '5000won', '천원': '1000won', '오만원': '50000won',
    '백원': '100won-coin', '코인': 'coin', '지폐': 'bill', '돼지저금통': 'piggybank',
    '마일리지': 'mileage', '포인트': 'point',
    # 쿠폰/세일
    '쿠폰': 'coupon', '세일택': 'saletag', '할인': 'discount',
    # 선물/이벤트
    '선물상자': 'giftbox', '박스': 'box', '랜덤박스': 'randombox',
    '쇼핑백': 'shoppingbag', '쇼핑카트': 'shoppingcart', '장바구니': 'basket',
    '트럭': 'truck', '뽑기기계': 'gachamachine', '뽑기캡슐': 'gachacapsule',
    '룰렛': 'roulette', '주사위': 'dice', '랭킹': 'ranking',
    '메달': 'medal', '트로피': 'trophy', '왕관': 'crown',
    # 의류/패션
    '가디건': 'cardigan', '레깅스': 'leggings', '맨투맨': 'sweatshirt',
    '민소매': 'sleeveless', '바지': 'pants', '반소매티셔츠': 'tshirt',
    '블라우스': 'blouse', '신발': 'shoes', '원피스': 'dress',
    '이너웨어': 'innerwear', '자켓': 'jacket', '치마': 'skirt',
    '트렌치코트': 'trenchcoat', '후드티': 'hoodie', '옷걸이': 'hanger', '모자': 'hat',
    '패딩': 'puffer',
    # 뷰티/미용
    '고데기': 'curlingiron', '괄사': 'guasha', '드라이기': 'hairdryer',
    '마사지기': 'massager', '머리빗': 'comb', '브러쉬': 'brush',
    '화장품': 'cosmetics', '헤어밴드': 'hairband',
    # 액세서리
    '가방': 'bag', '주얼리': 'jewelry', '워치': 'watch',
    '선글라스': 'sunglasses', '키링': 'keyring', '핸드폰케이스': 'phonecase',
    '헤드셋': 'headset', '캐리어': 'carrier',
    # 문구/가전
    'TV': 'tv', '선풍기': 'fan', '조명': 'light', '전구': 'bulb',
    '책': 'book', '연필': 'pencil', '돋보기': 'magnifier', '폴더': 'folder',
    '도장': 'stamp', '체크': 'check',
    # 음식/음료
    '음료': 'drink', '커피잔': 'coffeecup', '컵': 'cup', '텀블러': 'tumbler',
    '케이크': 'cake', '도넛': 'donut', '초콜릿': 'chocolate',
    '팬케이크': 'pancake', '스낵': 'snack', '프로틴': 'protein',
    '사과': 'apple', '체리': 'cherry', '당근': 'carrot', '주전자': 'kettle',
    '핫초코': 'hotchoco', '수박': 'watermelon', '아이스크림': 'icecream',
    # 봄/여름
    '꽃': 'flower', '나비': 'butterfly', '네잎클로버': 'fourleafclover',
    '새싹': 'sprout', '해바라기': 'sunflower', '화분': 'pot',
    '서핑보드': 'surfboard', '비치볼': 'beachball', '파라솔': 'parasol',
    '튜브': 'tube', '플라밍고튜브': 'flamingotube', '물안경': 'goggles',
    '모래성': 'sandcastle', '야자수': 'palmtree', '우산': 'umbrella', '우비': 'raincoat',
    '오리': 'duck',
    # 가을/겨울
    '단풍잎': 'mapleleaf', '은행잎': 'ginkgoleaf', '도토리': 'acorn',
    '솔방울': 'pinecone', '호박': 'pumpkin', '열매': 'berry',
    '다람쥐': 'squirrel', '보름달': 'fullmoon',
    '눈': 'snow', '눈사람': 'snowman', '스노우볼': 'snowglobe',
    '트리': 'christmastree', '오너먼트': 'ornament',
    '산타': 'santa', '산타모자': 'santahat', '지팡이': 'candycane',
    '진저쿠키': 'gingercookie', '리본': 'ribbon',
    # 신년/명절
    '송편': 'songpyeon', '약과': 'yakgwa', '복주머니': 'luckybag',
    '풍선': 'balloon', '폭죽': 'firework',
    # 긴급
    '전자시계': 'digitalclock', '자명종시계': 'alarmclock', '초시계': 'stopwatch',
    '모래시계': 'hourglass', '폭탄': 'bomb', '사이렌': 'siren',
    '번개': 'lightning', '알림종': 'bell', '불꽃': 'flame',
    # 홍보/소통
    '확성기': 'megaphone', '깃발': 'flag', '호루라기': 'whistle', '손': 'hand',
    '편지': 'letter', '우체통': 'postbox', '우체토': 'posttok', '종이비행기': 'paperplane',
    # 성장/목표
    '상승그래프': 'graphup', '목표': 'goal', '화살표': 'arrow',
    # 장식/데코
    '별': 'star', '하트': 'heart', '컨페티': 'confetti',
    # 기타
    '버튼': 'button', '달력': 'calendar', '인형': 'doll', '나무': 'tree',
    '날개': 'wing', '고정핀': 'pin', '퍼즐': 'puzzle', '숫자': 'number',
    '비행기': 'airplane', '낙하산': 'parachute', '자물쇠': 'lock',
    # 복합 키워드 (소구점+서브)
    '머니건': 'moneygun', '무한대': 'infinity', '돈': 'money',
    '선물과 돈': 'giftmoney',
    '돋보기 아바타': 'magnifier-avatar',
    '보상': 'reward', '불 시계': 'fireclock',
    # 배경 전용
    '낙엽': 'leaves', '단풍': 'maple',
    # 기타 잡
    '피크닉바구니': 'picnicbasket', '비행기': 'airplane',
    '무한대': 'infinity',
    # 배경 전용 접두사
    '지폐뭉치': 'billbundle', '쿠폰뭉치': 'couponbundle',
    '파도': 'wave',
}

# 배경 배너타입 접미사 매핑
BG_SUFFIX_MAP = {
    '-팝업': '-popup',
    '-컨텐츠': '-content',
    '-롤링': '-rolling',
    '-BM': '-bm',
}

def translate_filename(filename, is_background=False):
    """한글 파일명 → 영어 파일명 변환"""
    name = filename.replace('.png', '')

    if is_background:
        # 배경: "컨페티 3-팝업.png" → "confetti3-popup.png"
        suffix = ''
        for ko_suf, en_suf in BG_SUFFIX_MAP.items():
            if ko_suf in name:
                suffix = en_suf
                name = name.split(ko_suf)[0]
                break
        # -1 같은 변형 접미사
        variant = ''
        if name.endswith('-1'):
            variant = '-v2'
            name = name[:-2]

        translated = translate_prefix(name.strip())
        return f"{translated}{variant}{suffix}.png"
    else:
        # 3D: "혜택 선물과 돈1-1.png" → "benefit-giftmoney1-1.png"
        return translate_3d_name(name) + '.png'


def translate_prefix(name):
    """배경 접두사 번역"""
    # 정확히 매칭되는 긴 키워드부터 시도
    sorted_keys = sorted(KO_TO_EN.keys(), key=len, reverse=True)
    result = name
    for ko, en in sorted(KO_TO_EN.items(), key=lambda x: -len(x[0])):
        result = result.replace(ko, en)
    # 공백 제거, 괄호 처리
    result = result.replace(' ', '-').replace('(', '-').replace(')', '')
    # 연속 하이픈 정리
    result = re.sub(r'-+', '-', result).strip('-')
    return result.lower()


def translate_3d_name(name):
    """3D 에셋 이름 번역"""
    # 긴 키워드부터 치환
    result = name
    for ko, en in sorted(KO_TO_EN.items(), key=lambda x: -len(x[0])):
        result = result.replace(ko, en)
    # 공백→하이픈, 소문자
    result = result.replace(' ', '-').replace('(', '-').replace(')', '')
    result = re.sub(r'-+', '-', result).strip('-')
    # 노드ID 패턴 유지 (_21825-xxxxx)
    return result.lower()


def main():
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    rename_map = {}  # old_path → new_path (relative to public/)

    # 3D 에셋
    d3_dir = os.path.join(base, 'public', 'assets', '3d')
    for f in sorted(os.listdir(d3_dir)):
        if not f.endswith('.png'):
            continue
        new_name = translate_filename(f, is_background=False)
        if f != new_name:
            old_rel = f'/assets/3d/{f}'
            new_rel = f'/assets/3d/{new_name}'
            rename_map[old_rel] = new_rel

    # 배경 에셋
    bg_dir = os.path.join(base, 'public', 'assets', 'backgrounds')
    for f in sorted(os.listdir(bg_dir)):
        if not f.endswith('.png'):
            continue
        new_name = translate_filename(f, is_background=True)
        if f != new_name:
            old_rel = f'/assets/backgrounds/{f}'
            new_rel = f'/assets/backgrounds/{new_name}'
            rename_map[old_rel] = new_rel

    # 결과 출력
    print(f"총 리네임 대상: {len(rename_map)}개")
    print()

    # JSON으로 저장
    output_path = os.path.join(base, 'scripts', 'rename-map.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(rename_map, f, ensure_ascii=False, indent=2)
    print(f"매핑 저장: {output_path}")

    # 샘플 출력
    print("\n=== 샘플 (처음 30개) ===")
    for i, (old, new) in enumerate(rename_map.items()):
        if i >= 30:
            print(f"  ... +{len(rename_map)-30}개 더")
            break
        print(f"  {old}")
        print(f"  → {new}")
        print()


if __name__ == '__main__':
    main()

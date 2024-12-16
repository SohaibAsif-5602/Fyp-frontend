# -*- coding: utf-8 -*-
"""
Created on Sun Oct 20 22:28:43 2024

@author: HP
"""

from pydantic import BaseModel

class FishModel(BaseModel):
    Temperature: float
    Turbidity: float
    PH: float
    Fish: str  # Add fish species
    